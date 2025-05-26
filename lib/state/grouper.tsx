"use client";

import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { GridState } from "ag-grid-community";

export type Group = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type GroupContextType = {
  group: Group;
  setGroup: (group: Group) => void;
};

type SymbolFilter = { state: GridState["filter"]; name: string };
type GroupSymbolContextType = {
  symbols: Record<Group, string>;
  switchSymbol: (group: Group, symbol: string) => void;
  switchFilter: (group: Group, f?: SymbolFilter) => void;
  filter?: Record<Group, SymbolFilter>;
};

// Create a BroadcastChannel for cross-window communication
const symbolChannel =
  typeof window !== "undefined"
    ? new BroadcastChannel("group-symbol-channel")
    : null;

const filterChannel =
  typeof window !== "undefined"
    ? new BroadcastChannel("group-filter-channel")
    : null;

const GROUP_SYMBOL_STORAGE_KEY = "group-symbols";
const GROUP_FILTER_STORAGE_KEY = "group-filter";

// eslint-disable-next-line
// @ts-ignore
const GrouperContext = createContext<GroupContextType>();

export function GrouperProvider(props: {
  children: ReactNode;
  group: Group;
  onChange?: (group: Group) => void;
}) {
  const [group, setGroup] = useState<Group>(props.group);
  const setGroupCb = useCallback(
    (group: Group) => {
      setGroup(group);
      props.onChange?.(group);
    },
    [props],
  );
  return (
    <GrouperContext.Provider
      value={{
        group,
        setGroup: setGroupCb,
      }}
    >
      {props.children}
    </GrouperContext.Provider>
  );
}

// eslint-disable-next-line
// @ts-ignore
const GroupSymbolContext = createContext<GroupSymbolContextType>();

interface GroupSymbolProviderProps extends HTMLAttributes<HTMLDivElement> {
  def?: Partial<Record<Group, string>>;
}

export function GroupSymbolProvider(props: GroupSymbolProviderProps) {
  const [groupSymbols, setGroupSymbol] = useState<Record<Group, string>>(() => {
    if (props.def) return props.def;
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(GROUP_SYMBOL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [groupFilter, setGroupFilter] = useState<Record<Group, SymbolFilter>>(
    () => {
      // Initialize from localStorage if available
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(GROUP_FILTER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      }
      return {};
    },
  );

  // Listen for changes from other windows
  useEffect(() => {
    if (!symbolChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { groupId, symbol } = event.data;
      setGroupSymbol((s) => ({ ...s, [groupId]: symbol }));
    };

    symbolChannel.addEventListener("message", handleMessage);
    return () => symbolChannel.removeEventListener("message", handleMessage);
  }, []);

  // Update localStorage when symbols change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        GROUP_SYMBOL_STORAGE_KEY,
        JSON.stringify(groupSymbols),
      );
    }
  }, [groupSymbols]);

  // Update localStorage when filter change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        GROUP_FILTER_STORAGE_KEY,
        JSON.stringify(groupFilter),
      );
    }
  }, [groupFilter]);

  const switchSymbol = useCallback(
    (groupId: Group, symbol: string) => {
      setGroupSymbol((s) => ({ ...s, [groupId]: symbol }));

      // Broadcast the change to other windows
      if (symbolChannel) {
        symbolChannel.postMessage({ groupId, symbol });
      }
    },
    [setGroupSymbol],
  );

  const switchFilter = useCallback(
    (groupId: Group, filter?: SymbolFilter) => {
      setGroupFilter((s) => ({ ...s, [groupId]: filter }));

      // Broadcast the change to other windows
      if (filterChannel) {
        filterChannel.postMessage({ groupId, filter });
      }
    },
    [setGroupFilter],
  );

  return (
    <GroupSymbolContext.Provider
      value={{
        symbols: groupSymbols,
        switchSymbol,
        switchFilter,
        filter: groupFilter,
      }}
    >
      {props.children}
    </GroupSymbolContext.Provider>
  );
}

export function useGrouper() {
  return useContext(GrouperContext);
}

export function useSymbolGrouper() {
  return useContext(GroupSymbolContext);
}

export function useGroup() {
  return useGrouper().group;
}

export function useSetGroup() {
  return useGrouper().setGroup;
}

export function useGroupSymbolSwitcher() {
  const group = useGroup();
  const { switchSymbol } = useSymbolGrouper();

  return useCallback(
    (symbol: string) => switchSymbol(group, symbol),
    [switchSymbol, group],
  );
}

export function useGroupFilterSwitcher() {
  const group = useGroup();
  const { switchFilter } = useSymbolGrouper();

  return useCallback(
    (f: SymbolFilter) => switchFilter(group, f),
    [switchFilter, group],
  );
}

export function useGroupFilterClear() {
  const group = useGroup();
  const { switchFilter } = useSymbolGrouper();

  return useCallback(
    () => switchFilter(group, undefined),
    [switchFilter, group],
  );
}

export function useGroupSymbol() {
  const group = useGroup();
  return useContext(GroupSymbolContext).symbols?.[group];
}

export function useGroupFilter() {
  const group = useGroup();
  return useContext(GroupSymbolContext).filter?.[group];
}
