"use client";

import {
  Check,
  ChevronsUpDown,
  Copy,
  Edit,
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
  useCreateWatchlist,
  useDeleteWatchlist,
  useWatchlist,
} from "@/lib/state/symbol";
import { toast } from "sonner";
import { Json, Watchlist } from "@/types/supabase";
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
import { useActiveWatchlistId } from "@/hooks/use-active-watchlist";
import { WatchlistSymbol } from "@/components/watchlist/watchlist-symbol";

export function WatchlistSelector() {
  const { activeWatchlistId, setActiveWatchlistId } = useActiveWatchlistId();
  const { data: watchlist = [] } = useWatchlist();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSymbolDialog, setOpenSymbolDialog] = useState(false);
  const [newWatchlistDefault, setNewWatchlistDefault] =
    useState<Pick<Watchlist, "name" | "state" | "symbols">>();
  const activeWatchlist = watchlist?.find((s) => s.id === activeWatchlistId);

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
              if (!activeWatchlist) setOpen(!open);
            }}
          >
            {activeWatchlist?.name || "My Watchlist"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search watchlist..." className="h-9" />
            <CommandList>
              <CommandEmpty>No watchlist found.</CommandEmpty>
              <CommandGroup>
                {watchlist.map((watchlist) => (
                  <CommandItem
                    key={watchlist.id}
                    className="font-bold group relative"
                    value={watchlist.id}
                    onSelect={(currentValue) => {
                      setActiveWatchlistId(
                        currentValue === activeWatchlistId
                          ? null
                          : currentValue,
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeWatchlistId === watchlist.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{watchlist.name}</span>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveWatchlistId(watchlist.id);
                        setOpenSymbolDialog(true);
                      }}
                    >
                      <Edit size="3" />
                    </Button>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewWatchlistDefault({
                          name: `${watchlist.name} (Copy)`,
                          state: watchlist.state,
                          symbols: watchlist.symbols,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <Copy size="3" />
                    </Button>
                    <DeleteWatchlist watchlist={watchlist}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash size="3" />
                      </Button>
                    </DeleteWatchlist>
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
          setNewWatchlistDefault(undefined);
          setOpenDialog(true);
        }}
      >
        <Plus className="size-4" />
      </Button>

      <WatchlistCreatorDialog
        open={openDialog}
        setOpen={setOpenDialog}
        default={newWatchlistDefault}
      />

      {activeWatchlist && (
        <WatchlistSymbol
          open={openSymbolDialog}
          setOpen={setOpenSymbolDialog}
          watchlist={activeWatchlist}
        />
      )}
    </div>
  );
}

export function WatchlistCreatorDialog({
  open,
  setOpen,
  default: defaultState,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  default?: { name: string; state: Json; symbols: string[] };
}) {
  const { setActiveWatchlistId } = useActiveWatchlistId();

  const { mutate: createWatchlist, isPending } = useCreateWatchlist(
    (watchlist) => {
      setOpen(false);
      toast(`${watchlist.name} watchlist created!`);
      setActiveWatchlistId(watchlist.id);
    },
  );
  const [watchlistName, setNewWatchlistName] = useState<string>();
  useEffect(() => setNewWatchlistName(defaultState?.name), [defaultState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultState?.name ? "Clone Watchlist" : "Create New Watchlist"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Watchlist Name</Label>
            <Input
              id="name"
              value={watchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              placeholder="Enter watchlist"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!watchlistName}
            onClick={(e) => {
              e.stopPropagation();
              createWatchlist({
                name: watchlistName!,
                state: defaultState?.state,
                symbols: defaultState?.symbols ?? [],
              });
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

function DeleteWatchlist({
  watchlist,
  children,
}: {
  watchlist: Watchlist;
  children: ReactNode;
}) {
  const { mutate: deleteWatchlist } = useDeleteWatchlist(() =>
    toast(`Deleted ${watchlist.name}`),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Watchlist</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-destructive">
              {" "}
              {watchlist.name}
            </span>{" "}
            watchlist
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteWatchlist(watchlist.id)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
