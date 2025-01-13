import { ReactNode } from "react";
import { type Group, GrouperProvider } from "@/lib/state/grouper";

export function Grouper(props: { children: ReactNode; group: Group }) {
  return (
    <GrouperProvider group={props.group}>{props.children}</GrouperProvider>
  );
}
