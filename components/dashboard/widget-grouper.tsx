"use client";

import { Group, useGroup, useSetGroup } from "@/lib/state/grouper";
import { HTMLAttributes, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const groupColors: Record<Group, string> = {
  0: "bg-gray-200", // Default light gray
  1: "bg-blue-500", // Blue
  2: "bg-red-500", // Red
  3: "bg-yellow-400", // Yellow
  4: "bg-green-500", // Green
  5: "bg-purple-600", // Purple
  6: "bg-red-800", // Brown-red
  7: "bg-orange-500", // Orange
  8: "bg-amber-800", // Brown
  9: "bg-pink-500", // Pink
};

export const GroupSelector = (props: HTMLAttributes<HTMLDivElement>) => {
  const currentGroup = useGroup();
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(groupColors[currentGroup], "size-5")}
        >
          {currentGroup}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <GroupSelectorContent />
      </PopoverContent>
    </Popover>
  );
};

export const GroupSelectorContent = () => {
  const currentGroup = useGroup();
  const setGroup = useSetGroup();

  const groupButtons = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => i as Group).map((groupId) => (
      <div key={groupId}>
        <Button
          onClick={() => setGroup(groupId)}
          variant="ghost"
          size="sm"
          className={cn(groupColors[currentGroup], {
            "ring-2 ring-white": currentGroup === groupId,
          })}
        >
          {groupId}
        </Button>
      </div>
    ));
  }, [currentGroup, setGroup]);

  return <div className="flex w-48">{groupButtons}</div>;
};
