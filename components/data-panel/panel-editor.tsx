"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Pencil, Save, Trash, X } from "lucide-react";
import { useDeleteDataPanel, useUpdateDataPanel } from "@/lib/state/symbol";
import { Section } from "./types";
import { Json } from "@/types/generated/supabase";
import { UpdateDataPanel } from "@/types/supabase";
import { defaultColumns } from "@/components/symbols/columns";
import { toast } from "sonner";
import { ColDef } from "ag-grid-community";
import { Symbol } from "@/types/symbol";

/**
 * Component for editing existing data panels
 *
 * @param open - Whether the dialog is open
 * @param setOpen - Function to set the open state
 * @param panelId - ID of the panel being edited
 * @param panelName - Name of the panel being edited
 * @param initialSections - Initial sections configuration
 */
export function DataPanelEditor({
  open,
  setOpen,
  panelId,
  panelName,
  initialSections,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  panelId: string;
  panelName: string;
  initialSections: Section[];
}) {
  const [name, setName] = useState(panelName);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingSection, setEditingSection] = useState<{
    index: number;
    section: Section | null;
  }>({ index: -1, section: null });
  const [confirmDeleteSection, setConfirmDeleteSection] = useState<
    number | null
  >(null);
  const updateDataPanel = useUpdateDataPanel();
  const deleteDataPanel = useDeleteDataPanel();
  // components/symbols/data-panel/data-panel-editor.tsx (continued)
  const [confirmDeletePanel, setConfirmDeletePanel] = useState(false);

  /**
   * Get column lookup for display
   */
  const columnMap = defaultColumns.reduce(
    (acc, col) => {
      if (col.colId) {
        acc[col.colId] = col;
      }
      return acc;
    },
    {} as Record<string, ColDef<Symbol>>,
  );

  /**
   * Save panel changes
   */
  const handleSave = async () => {
    if (!name) {
      toast.error("Panel name is required");
      return;
    }

    if (sections.length === 0) {
      toast.error("At least one section is required");
      return;
    }

    try {
      const updatePayload: UpdateDataPanel = {
        name,
        sections: sections as unknown as Json,
      };

      await updateDataPanel.mutateAsync({
        id: panelId,
        payload: updatePayload,
      });

      toast.success("Panel updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update panel");
      console.error(error);
    }
  };

  /**
   * Delete the entire panel
   */
  const handleDeletePanel = async () => {
    try {
      await deleteDataPanel.mutateAsync(panelId);
      toast.success("Panel deleted successfully");
      setOpen(false);
      setConfirmDeletePanel(false);
    } catch (error) {
      toast.error("Failed to delete panel");
      console.error(error);
    }
  };

  /**
   * Start editing a section
   */
  const startEditSection = (index: number) => {
    setEditingSection({
      index,
      section: { ...sections[index] },
    });
  };

  /**
   * Cancel section editing
   */
  const cancelEditSection = () => {
    setEditingSection({ index: -1, section: null });
  };

  /**
   * Save section changes
   */
  const saveEditSection = () => {
    if (!editingSection.section || editingSection.section.name === "") {
      toast.error("Section name cannot be empty");
      return;
    }

    if (editingSection.section.columnIds.length === 0) {
      toast.error("Section must have at least one column");
      return;
    }

    const newSections = [...sections];
    newSections[editingSection.index] = { ...editingSection.section };
    setSections(newSections);
    setEditingSection({ index: -1, section: null });
  };

  /**
   * Add a new section to the panel
   */
  const addNewSection = () => {
    setEditingSection({
      index: sections.length,
      section: { name: "", columnIds: [] },
    });
  };

  /**
   * Delete a section from the panel
   */
  const handleDeleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    setConfirmDeleteSection(null);
  };

  /**
   * Move a section up or down in the list
   */
  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return; // Can't move beyond boundaries
    }

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap the sections
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];
    setSections(newSections);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Panel</DialogTitle>
            <DialogDescription>
              Customize your data panel by editing sections and columns
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="panel-name" className="text-right">
                Panel Name
              </Label>
              <Input
                id="panel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="My Panel Name"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Panel Sections</h3>
                <Button variant="outline" size="sm" onClick={addNewSection}>
                  Add Section
                </Button>
              </div>

              {/* Section editor dialog */}
              {editingSection.section && (
                <div className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">
                      {editingSection.index < sections.length
                        ? "Edit Section"
                        : "Add New Section"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditSection}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-section-name" className="text-right">
                        Section Name
                      </Label>
                      <Input
                        id="edit-section-name"
                        value={editingSection.section.name}
                        onChange={(e) =>
                          setEditingSection((prev) => ({
                            ...prev,
                            section: prev.section
                              ? {
                                  ...prev.section,
                                  name: e.target.value,
                                }
                              : null,
                          }))
                        }
                        className="col-span-3"
                        placeholder="e.g. Price Information"
                      />
                    </div>

                    {/* Column selector */}
                    <div className="mt-2">
                      {/* ... column editing UI ... */}
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={cancelEditSection}>
                          Cancel
                        </Button>
                        <Button onClick={saveEditSection}>
                          {editingSection.index < sections.length
                            ? "Update Section"
                            : "Add Section"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* List of current sections */}
              <div className="space-y-2 border rounded-md max-h-96 overflow-y-auto p-2">
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <div
                      key={`${section.name}-${index}`}
                      className="border rounded-md p-3 hover:bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{section.name}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveSection(index, "up")}
                            disabled={index === 0}
                          >
                            <ChevronDown className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => moveSection(index, "down")}
                            disabled={index === sections.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => startEditSection(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => setConfirmDeleteSection(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Columns: {section.columnIds.length}</p>
                        <div className="mt-1 max-h-24 overflow-y-auto grid grid-cols-2 gap-x-2 gap-y-1">
                          {section.columnIds.map((colId) => {
                            const column = columnMap[colId];
                            return column ? (
                              <div key={colId} className="truncate">
                                {column.headerName}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No sections added yet. Add a section to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => setConfirmDeletePanel(true)}
            >
              Delete Panel
            </Button>
            <div>
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Update Panel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete section alert */}
      <AlertDialog
        open={confirmDeleteSection !== null}
        onOpenChange={(open) => !open && setConfirmDeleteSection(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                confirmDeleteSection !== null &&
                handleDeleteSection(confirmDeleteSection)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm delete panel alert */}
      <AlertDialog
        open={confirmDeletePanel}
        onOpenChange={setConfirmDeletePanel}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Panel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this panel? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeletePanel}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
