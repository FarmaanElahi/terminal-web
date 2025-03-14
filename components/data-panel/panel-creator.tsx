"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section } from "./types";
import { Json } from "@/types/generated/supabase";
import { InsertDataPanel, UpdateDataPanel } from "@/types/supabase";
import {
  useCreateDataPanel,
  useDeleteDataPanel,
  useUpdateDataPanel,
} from "@/lib/state/symbol";
import { defaultColumns } from "@/components/symbols/columns";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { ColDef } from "ag-grid-community";
import { Symbol } from "@/types/symbol";

/**
 * Component for creating or updating data panels
 *
 * @param open - Whether the dialog is open
 * @param setOpen - Function to set the open state
 * @param initialSections - Initial sections to populate the creator with
 * @param panelId - Optional panel ID for updating existing panels
 * @param panelName - Optional panel name for updating existing panels
 */
export function DataPanelCreator({
  open,
  setOpen,
  initialSections = [],
  panelId,
  panelName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialSections?: Section[];
  panelId?: string;
  panelName?: string;
}) {
  const [name, setName] = useState(panelName || "");
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [currentSection, setCurrentSection] = useState<Section>({
    name: "",
    columnIds: [],
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const createDataPanel = useCreateDataPanel();
  const updateDataPanel = useUpdateDataPanel();
  const deleteDataPanel = useDeleteDataPanel();

  // Extract all categories from defaultColumns
  useEffect(() => {
    const categories = new Set<string>();
    defaultColumns.forEach((col) => {
      if (col.context?.category) {
        categories.add(col.context.category as string);
      }
    });
    setAvailableCategories(Array.from(categories));
  }, []);

  // Group columns by category
  const columnsByCategory = useMemo(() => {
    const grouped: Record<string, Array<ColDef<Symbol>>> = {};
    defaultColumns.forEach((col) => {
      const category = (col.context?.category as string) || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(col);
    });
    return grouped;
  }, []);

  /**
   * Add the current section to the panel
   */
  const handleAddSection = () => {
    if (!currentSection.name || currentSection.columnIds.length === 0) {
      toast.error("Section name and at least one column are required");
      return;
    }

    setSections((prev) => [...prev, { ...currentSection }]);
    setCurrentSection({ name: "", columnIds: [] });
  };

  /**
   * Save the panel configuration
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
      if (panelId) {
        // Update existing panel
        const updatePayload: UpdateDataPanel = {
          name,
          sections: sections as unknown as Json,
        };

        await updateDataPanel.mutateAsync({
          id: panelId,
          payload: updatePayload,
        });

        toast.success("Panel updated successfully");
      } else {
        // Create new panel
        const createPayload: InsertDataPanel = {
          name,
          sections: sections as unknown as Json,
        };

        await createDataPanel.mutateAsync(createPayload);

        toast.success("Panel created successfully");
      }

      setOpen(false);
    } catch (error) {
      toast.error("Failed to save panel");
      console.error(error);
    }
  };

  /**
   * Delete an existing panel
   */
  const handleDelete = async () => {
    if (!panelId) return;

    try {
      await deleteDataPanel.mutateAsync(panelId);
      toast.success("Panel deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete panel");
      console.error(error);
    }
  };

  /**
   * Remove a section from the panel
   */
  const handleRemoveSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Toggle a column's inclusion in the current section
   */
  const handleColumnToggle = (colId: string) => {
    setCurrentSection((prev) => {
      const exists = prev.columnIds.includes(colId);
      if (exists) {
        return {
          ...prev,
          columnIds: prev.columnIds.filter((id) => id !== colId),
        };
      } else {
        return {
          ...prev,
          columnIds: [...prev.columnIds, colId],
        };
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {panelId ? "Edit Panel" : "Create New Panel"}
          </DialogTitle>
          <DialogDescription>
            Configure your data panel with custom sections and columns
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Panel Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="My Custom Panel"
            />
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium">Current Sections</h3>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded-md"
                >
                  <div>
                    <span className="font-medium">{section.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({section.columnIds.length} columns)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {sections.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">
                  No sections added yet. Add a section below.
                </div>
              )}
            </div>
          </div>

          {/* Section and column selection UI */}
          <div className="border-t pt-4">
            <h3 className="mb-2 text-sm font-medium">Add New Section</h3>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="sectionName" className="text-right">
                Section Name
              </Label>
              <Input
                id="sectionName"
                value={currentSection.name}
                onChange={(e) =>
                  setCurrentSection((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
                placeholder="e.g. Price Information"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Select Category</Label>
              <div className="col-span-3">
                <Select
                  onValueChange={() => {
                    setCurrentSection((prev) => ({ ...prev, columnIds: [] }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="mt-4 max-h-48 overflow-y-auto border rounded-md p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(columnsByCategory).map(([, columns]) => (
                      <>
                        {columns.map((column) => (
                          <div key={column.colId} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`col-${column.colId}`}
                              checked={currentSection.columnIds.includes(
                                column.colId as string,
                              )}
                              onChange={() =>
                                handleColumnToggle(column.colId as string)
                              }
                              className="mr-2"
                            />
                            <label
                              htmlFor={`col-${column.colId}`}
                              className="text-sm"
                            >
                              {column.headerName}
                            </label>
                          </div>
                        ))}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                onClick={handleAddSection}
                disabled={
                  !currentSection.name || currentSection.columnIds.length === 0
                }
              >
                Add Section
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {panelId && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Panel
            </Button>
          )}
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
              {panelId ? "Update Panel" : "Create Panel"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
