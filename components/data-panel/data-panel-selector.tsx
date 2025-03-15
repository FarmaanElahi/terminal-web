// components/data-panel/data-panel-selector.tsx
"use client";

import { Check, ChevronsUpDown, Copy, Plus, Trash, Edit } from "lucide-react";
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
import { Section } from "./types";

export function DataPanelSelector() {
  const { activeDataPanelId, setActiveDataPanelId } = useActiveDataPanelId();
  const { data: dataPanels = [] } = useDataPanels();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const activeDataPanel = dataPanels?.find((p) => p.id === activeDataPanelId);
  const [selectedPanelForAction, setSelectedPanelForAction] =
    useState<DataPanel | null>(null);

  const handleNewPanel = () => {
    setEditMode(false);
    setSelectedPanelForAction(null);
    setOpenDialog(true);
  };

  const handleEditPanel = () => {
    if (activeDataPanel) {
      setEditMode(true);
      setSelectedPanelForAction(activeDataPanel);
      setOpenDialog(true);
    }
  };

  const handleClonePanel = (panel: DataPanel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(false);
    setSelectedPanelForAction({
      ...panel,
      name: `${panel.name} (Copy)`,
    });
    setOpenDialog(true);
  };

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
                      onClick={(e) => handleClonePanel(panel, e)}
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

      {/* Edit button - only shows when there's an active panel */}
      {activeDataPanel && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditPanel}
          title="Edit current panel"
        >
          <Edit className="size-4" />
        </Button>
      )}

      {/* Create new panel button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNewPanel}
        title="Create new panel"
      >
        <Plus className="size-4" />
      </Button>

      {/* The DataPanelCreator with conditionally set props based on mode */}
      {openDialog && (
        <DataPanelCreator
          open={openDialog}
          setOpen={setOpenDialog}
          initialSections={
            (selectedPanelForAction?.sections as Section[]) || []
          }
          panelId={editMode ? selectedPanelForAction?.id : undefined}
          panelName={selectedPanelForAction?.name || ""}
        />
      )}
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
