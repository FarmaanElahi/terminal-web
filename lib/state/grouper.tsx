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

export type Group = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type GroupContextType = {
  group: Group;
  setGroup: (group: Group) => void;
};

type GroupSymbolContextType = {
  symbols: Record<Group, string>;
  switchSymbol: (group: Group, symbol: string) => void;
};

// Create a BroadcastChannel for cross-window communication
const symbolChannel = typeof window !== 'undefined'
  ? new BroadcastChannel('group-symbol-channel')
  : null;

const LOCAL_STORAGE_KEY = 'group-symbols';

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
    <GrouperContext.Provider value={{ group, setGroup: setGroupCb }}>
      {props.children}
    </GrouperContext.Provider>
  );
}

// eslint-disable-next-line
// @ts-ignore
const GroupSymbolContext = createContext<GroupSymbolContextType>();

export function GroupSymbolProvider(props: HTMLAttributes<HTMLDivElement>) {
  const [groupSymbols, setGroupSymbol] = useState<Record<Group, string>>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  // Listen for changes from other windows
  useEffect(() => {
    if (!symbolChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { groupId, symbol } = event.data;
      setGroupSymbol((s) => ({ ...s, [groupId]: symbol }));
    };

    symbolChannel.addEventListener('message', handleMessage);
    return () => symbolChannel.removeEventListener('message', handleMessage);
  }, []);

  // Update localStorage when symbols change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groupSymbols));
    }
  }, [groupSymbols]);

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

  return (
    <GroupSymbolContext.Provider
      value={{ symbols: groupSymbols, switchSymbol }}
    >
      {props.children}
    </GroupSymbolContext.Provider>
  );
}

// ... rest of the hooks remain the same

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

export function useGroupSymbol() {
  const group = useGroup();
  return useContext(GroupSymbolContext).symbols?.[group];
}