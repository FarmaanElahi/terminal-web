"use client";

import {
  Check,
  ChevronsUpDown,
  Copy,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useCreateScreen,
  useDeleteScreen,
  useScreens,
} from "@/lib/state/symbol";
import { toast } from "sonner";
import { useActiveScreenerId } from "@/hooks/use-active-screener";
import { Json, Screen } from "@/types/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ScreenSelector() {
  const { activeScreenId, setActiveScreenId } = useActiveScreenerId();
  const { data: screens = [] } = useScreens();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newScreenDefault, setNewScreenDefault] =
    useState<Pick<Screen, "name" | "state">>();
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
              if (!activeScreen) setOpen(!open);
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
                    className="font-bold group relative"
                    value={screen.id}
                    onSelect={(currentValue) => {
                      setActiveScreenId(
                        currentValue === activeScreenId ? null : currentValue,
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeScreenId === screen.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{screen.name}</span>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNewScreenDefault({
                          name: `${screen.name} (Copy)`,
                          state: screen.state,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <Copy size="3" />
                    </Button>
                    <DeleteScreen screen={screen}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      >
                        <Trash size="3" />
                      </Button>
                    </DeleteScreen>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setNewScreenDefault(undefined);
          setOpenDialog(true);
        }}
      >
        <Plus className="size-4" />
      </Button>

      <ScreenCreatorDialog
        open={openDialog}
        setOpen={setOpenDialog}
        default={newScreenDefault}
      />
    </div>
  );
}

function ScreenCreatorDialog({
  open,
  setOpen,
  default: defaultState,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  default?: { name: string; state: Json };
  cloneFromId?: string;
}) {
  const { mutate: createScreen, isPending } = useCreateScreen((screen) => {
    setOpen(false);
    toast(`${screen.name} screen created!`);
  });
  const [screenName, setNewScreenName] = useState<string>();
  useEffect(() => setNewScreenName(defaultState?.name), [defaultState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultState?.name ? "Clone Screen" : "Create New Screen"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Screen Name</Label>
            <Input
              id="name"
              value={screenName}
              onChange={(e) => setNewScreenName(e.target.value)}
              placeholder="Enter screen name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!screenName}
            onClick={(e) => {
              e.stopPropagation();
              createScreen({ name: screenName!, state: defaultState?.state });
              setOpen(false);
            }}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultState?.name ? "Clone" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteScreen({
  screen,
  children,
}: {
  screen: Screen;
  children: ReactNode;
}) {
  const { mutate: deleteScreen } = useDeleteScreen(() =>
    toast(`Deleted ${screen.name}`),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Screener</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-destructive">
              {" "}
              {screen.name}
            </span>{" "}
            screener
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteScreen(screen.id)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
