import {
  useGroupFilter,
  useGroupFilterClear,
  useGroupSymbol,
} from "@/lib/state/grouper";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

export function GroupInfo({
  placeholder = "Search",
}: {
  name?: string;
  placeholder?: string;
}) {
  const symbol = useGroupSymbol()?.split(":")?.[1];
  const filter = useGroupFilter();
  const clearFilter = useGroupFilterClear();
  const groupValue = filter?.name || symbol;
  const value = groupValue || placeholder;
  return (
    <Button
      variant="outline"
      size="sm"
      className="font-bold justify-between w-48"
      onClick={() => (filter ? clearFilter() : null)}
    >
      {value}
      <X className="size-4  right-0" />
    </Button>
  );
}
