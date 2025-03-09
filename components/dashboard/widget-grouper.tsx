"use client";

import { Group, useGroup, useSetGroup } from "@/lib/state/grouper";
import { HTMLAttributes, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <Button className={` ${groupColors[currentGroup]}`}>
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
          className={`
          ${groupColors[groupId]}
          w-8 h-8 rounded 
          flex items-center justify-center
          text-white font-bold
          shadow-sm
          ${currentGroup === groupId ? "ring-2 ring-white" : ""}
        `}
        >
          {groupId}
        </Button>
      </div>
    ));
  }, [currentGroup, setGroup]);

  return <div className="flex w-48">{groupButtons}</div>;
};
