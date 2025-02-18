import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { useScreens } from "@/lib/state/symbol";

interface ScreenSelectorProps {
  activeScreenId: string | null;
  setActiveScreenId: (id: string | null) => void;
}

export function ScreenSelector({
  activeScreenId,
  setActiveScreenId,
}: ScreenSelectorProps) {
  const { data: screens } = useScreens();
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
          >
            {activeScreen?.name || "Select screen..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search screen..." />
            <CommandEmpty>No screen found.</CommandEmpty>
            <CommandGroup>
              {screens?.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.name}
                  onSelect={() => {
                    setActiveScreenId(s.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeScreenId === s.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {s.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={() => setOpenDialog(true)}>
        <Plus className="size-4" />
      </Button>

      {activeScreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveScreenId(null)}
        >
          <X className="size-4" />
        </Button>
      )}

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
              value={newScreenName}
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder="Enter screen name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
