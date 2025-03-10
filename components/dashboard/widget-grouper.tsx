"use client";

import { Group, useGroup, useSetGroup } from "@/lib/state/grouper";
import { HTMLAttributes, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const groupBgColor: Record<Group, string> = {
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

const groupRingColor: Record<Group, string> = {
  0: "ring-gray-200", // Default light gray
  1: "ring-blue-500", // Blue
  2: "ring-red-500", // Red
  3: "ring-yellow-400", // Yellow
  4: "ring-green-500", // Green
  5: "ring-purple-600", // Purple
  6: "ring-red-800", // Brown-red
  7: "ring-orange-500", // Orange
  8: "ring-amber-800", // Brown
  9: "ring-pink-500", // Pink
};

export const GroupSelector = (props: HTMLAttributes<HTMLDivElement>) => {
  const currentGroup = useGroup();
  const [open, setOpen] = useState(false);
  return (
    <Popover {...props} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-5 text-xs",
            groupBgColor[currentGroup],
            `hover:${groupBgColor[currentGroup]}`,
          )}
        >
          {currentGroup}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <GroupSelectorContent onOpenChange={setOpen} />
      </PopoverContent>
    </Popover>
  );
};

export const GroupSelectorContent = (props: {
  onOpenChange: (open: boolean) => void;
}) => {
  const currentGroup = useGroup();
  const setGroup = useSetGroup();

  const groupButtons = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => i as Group).map((groupId) => (
      <div key={groupId}>
        <Button
          onClick={() => {
            setGroup(groupId);
            props.onOpenChange(false);
          }}
          variant="ghost"
          size="icon"
          className={cn(
            "size-5 text-xs",
            groupBgColor[groupId],
            `hover:${groupBgColor[groupId]}`,
            {
              [`${groupRingColor[groupId]}`]: currentGroup === groupId,
              "ring-2 ring-offset-2": currentGroup === groupId,
            },
          )}
        >
          {groupId}
        </Button>
      </div>
    ));
  }, [currentGroup, setGroup]);

  return (
    <div className="flex flex-wrap gap-2 w-full justify-center">
      {groupButtons}
    </div>
  );
};
