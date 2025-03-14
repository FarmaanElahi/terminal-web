"use client";

import { Check, ChevronsUpDown, Copy, Plus, Trash } from "lucide-react";
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
import React, { ReactNode, useState } from "react";
import { toast } from "sonner";
import { DataPanel } from "@/types/supabase";
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
import { useDataPanels, useDeleteDataPanel } from "@/lib/state/symbol";
import { DataPanelCreator } from "@/components/data-panel/panel-creator";

export function DataPanelSelector() {
  const { activeDataPanelId, setActiveDataPanelId } = useActiveDataPanelId();
  const { data: dataPanels = [] } = useDataPanels();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [, setNewDataPanelDefault] =
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

      <DataPanelCreator open={openDialog} setOpen={setOpenDialog} />
    </div>
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
