"use client";

import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateScreen, useScreens } from "@/lib/state/symbol";
import { toast } from "sonner";
import { useActiveScreener } from "@/hooks/use-active-screener";

export function ScreenSelector() {
  const { activeScreenId, setActiveScreenId } = useActiveScreener();
  const { data: screens = [] } = useScreens();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const activeScreen = screens?.find((s) => s.id === activeScreenId);
  return (
    <div className="flex gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="w-[200px] justify-between font-bold"
            onClick={() => {
              if (!activeScreen) {
                setOpen(!open);
              }
            }}
          >
            {activeScreen?.name || "My Screens"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search screens..." className="h-9" />
            <CommandList>
              <CommandEmpty>No screen found.</CommandEmpty>
              <CommandGroup>
                {screens.map((screen) => (
                  <CommandItem
                    key={screen.id}
                    value={screen.id}
                    onSelect={(currentValue) => {
                      setActiveScreenId(
                        currentValue === activeScreenId ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    {screen.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        activeScreenId === screen.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
        <Plus className="size-4" />
      </Button>

      <ScreenCreatorDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
}

function ScreenCreatorDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [newScreenName, setNewScreenName] = useState<string>();
  const { mutate: createScreen, isPending } = useCreateScreen((screen) => {
    setOpen(false);
    toast(`${screen.name} screen created!`);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Screen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Screen Name</Label>
            <Input
              id="name"
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder="Enter screen name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!newScreenName}
            onClick={() => {
              createScreen({ name: newScreenName! });
              setOpen(false);
            }}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
