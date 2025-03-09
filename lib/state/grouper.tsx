"use client";

import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useState,
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

// eslint-disable-next-line
// @ts-ignore
const GrouperContext = createContext<GroupContextType>();

export function GrouperProvider(props: { children: ReactNode; group: Group }) {
  const [group, setGroup] = useState<Group>(props.group);
  return (
    <GrouperContext.Provider value={{ group, setGroup }}>
      {props.children}
    </GrouperContext.Provider>
  );
}

// eslint-disable-next-line
// @ts-ignore
const GroupSymbolContext = createContext<GroupSymbolContextType>();

export function GroupSymbolProvider(props: HTMLAttributes<HTMLDivElement>) {
  const [groupSymbols, setGroupSymbol] = useState({} as Record<Group, string>);
  const switchSymbol = useCallback(
    (groupId: Group, symbol: string) => {
      setGroupSymbol((s) => ({ ...s, [groupId]: symbol }));
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
