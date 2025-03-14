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
import { toast } from "sonner";
import { Json } from "@/types/supabase";
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
import { useActiveDataPanelId } from "@/hooks/use-active-data-panel";
import {
  useCreateDataPanel,
  useDataPanels,
  useDeleteDataPanel,
} from "@/lib/state/symbol";

// Type definition for DataPanel
interface DataPanel {
  id: string;
  name: string;
  sections: Json;
}

export function DataPanelSelector() {
  const { activeDataPanelId, setActiveDataPanelId } = useActiveDataPanelId();
  const { data: dataPanels = [] } = useDataPanels();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDataPanelDefault, setNewDataPanelDefault] =
    useState<Pick<DataPanel, "name" | "sections">>();
  const activeDataPanel = dataPanels?.find((p) => p.id === activeDataPanelId);

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
              if (!activeDataPanel) setOpen(!open);
            }}
          >
            {activeDataPanel?.name || "Default Data Panel"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search data panels..." className="h-9" />
            <CommandList>
              <CommandEmpty>No data panels found.</CommandEmpty>
              <CommandGroup>
                {dataPanels.map((panel) => (
                  <CommandItem
                    key={panel.id}
                    className="font-bold group relative"
                    value={panel.id}
                    onSelect={(currentValue) => {
                      setActiveDataPanelId(
                        currentValue === activeDataPanelId
                          ? null
                          : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeDataPanelId === panel.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{panel.name}</span>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewDataPanelDefault({
                          name: `${panel.name} (Copy)`,
                          sections: panel.sections,
                        });
                        setOpenDialog(true);
                      }}
                    >
                      <Copy size="3" />
                    </Button>
                    <DeleteDataPanel panel={panel}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash size="3" />
                      </Button>
                    </DeleteDataPanel>
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
          setNewDataPanelDefault(undefined);
          setOpenDialog(true);
        }}
      >
        <Plus className="size-4" />
      </Button>

      <DataPanelCreatorDialog
        open={openDialog}
        setOpen={setOpenDialog}
        default={newDataPanelDefault}
      />
    </div>
  );
}

interface DataPanelCreatorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  default?: { name: string; sections: Json };
}

export function DataPanelCreatorDialog({
  open,
  setOpen,
  default: defaultState,
}: DataPanelCreatorDialogProps) {
  const { setActiveDataPanelId } = useActiveDataPanelId();

  const { mutate: createDataPanel, isPending } = useCreateDataPanel((panel) => {
    setOpen(false);
    toast(`${panel.name} data panel created!`);
    setActiveDataPanelId(panel.id);
  });
  const [panelName, setPanelName] = useState<string>();
  useEffect(() => setPanelName(defaultState?.name), [defaultState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultState?.name ? "Clone Data Panel" : "Create New Data Panel"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Data Panel Name</Label>
            <Input
              id="name"
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
              placeholder="Enter panel name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!panelName}
            onClick={(e) => {
              e.stopPropagation();
              createDataPanel({
                name: panelName!,
                sections: defaultState?.sections || [],
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

interface DeleteDataPanelProps {
  panel: DataPanel;
  children: ReactNode;
}

function DeleteDataPanel({ panel, children }: DeleteDataPanelProps) {
  const { mutate: deleteDataPanel } = useDeleteDataPanel(() =>
    toast(`Deleted ${panel.name}`),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Data Panel</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-destructive">
              {" "}
              {panel.name}
            </span>{" "}
            data panel
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => deleteDataPanel(panel.id)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
