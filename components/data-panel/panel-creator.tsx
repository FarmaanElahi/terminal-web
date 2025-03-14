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
import {
  Edit,
  Grip,
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ColDef } from "ag-grid-community";
import { Symbol } from "@/types/symbol";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Sortable section item component
 */
function SortableSection({
  section,
  index,
  onEdit,
  onRemove,
}: {
  section: Section;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `section-${index}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border p-3 mb-2 rounded-md bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab focus:outline-none"
        >
          <Grip className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <span className="font-medium">{section.name}</span>
          <Badge variant="outline" className="ml-2 text-xs">
            {section.columnIds.length} columns
          </Badge>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Sortable column component
 */
function SortableColumn({
  column,
  checked,
  onToggle,
}: {
  column: ColDef<Symbol>;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center p-2 border rounded-md mb-1.5 hover:bg-accent/30 transition-colors">
      <input
        type="checkbox"
        id={`col-${column.colId}`}
        checked={checked}
        onChange={onToggle}
        className="mr-2"
      />
      <label htmlFor={`col-${column.colId}`} className="flex-1 cursor-pointer">
        {column.headerName}
      </label>
      {checked && (
        <div className="flex items-center gap-1">
          <Grip className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />
        </div>
      )}
    </div>
  );
}

/**
 * Sortable column item for reordering
 */
function SortableColumnItem({
  column,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  column: { id: string; name: string };
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `column-${index}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-2 border rounded-md mb-1.5 bg-accent/20"
    >
      <div
        className="cursor-grab focus:outline-none mr-2"
        {...attributes}
        {...listeners}
      >
        <Grip className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="flex-1 text-sm">{column.name}</span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

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
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null,
  );
  const [currentSection, setCurrentSection] = useState<Section>({
    name: "",
    columnIds: [],
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("sections");

  const createDataPanel = useCreateDataPanel();
  const updateDataPanel = useUpdateDataPanel();
  const deleteDataPanel = useDeleteDataPanel();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

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

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setEditingSectionIndex(null);
      setCurrentSection({ name: "", columnIds: [] });
      setSelectedCategory("");
    }
  }, [open]);

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
   * Start editing a section
   */
  const handleEditSection = (index: number) => {
    setEditingSectionIndex(index);
    setCurrentSection({ ...sections[index] });
    setActiveTab("editor");
  };

  /**
   * Cancel editing a section
   */
  const handleCancelEdit = () => {
    setEditingSectionIndex(null);
    setCurrentSection({ name: "", columnIds: [] });
  };

  /**
   * Add or update the current section
   */
  const handleSaveSection = () => {
    if (!currentSection.name || currentSection.columnIds.length === 0) {
      toast.error("Section name and at least one column are required");
      return;
    }

    if (editingSectionIndex !== null) {
      // Update existing section
      setSections((prev) =>
        prev.map((section, idx) =>
          idx === editingSectionIndex ? { ...currentSection } : section,
        ),
      );
      setEditingSectionIndex(null);
    } else {
      // Add new section
      setSections((prev) => [...prev, { ...currentSection }]);
    }

    setCurrentSection({ name: "", columnIds: [] });
    setActiveTab("sections");
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

  /**
   * Handle section drag end event to reorder sections
   */
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((sections) => {
        const oldIndex = parseInt(active.id.toString().split("-")[1]);
        const newIndex = parseInt(over?.id.toString().split("-")[1] || "0");

        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  };

  /**
   * Handle column drag end event to reorder columns
   */
  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCurrentSection((section) => {
        const oldIndex = parseInt(active.id.toString().split("-")[1]);
        const newIndex = parseInt(over?.id.toString().split("-")[1] || "0");

        return {
          ...section,
          columnIds: arrayMove(section.columnIds, oldIndex, newIndex),
        };
      });
    }
  };

  /**
   * Move a column up in the current section
   */
  const moveColumnUp = (index: number) => {
    if (index <= 0) return;
    setCurrentSection((section) => {
      const newColumnIds = [...section.columnIds];
      [newColumnIds[index - 1], newColumnIds[index]] = [
        newColumnIds[index],
        newColumnIds[index - 1],
      ];
      return { ...section, columnIds: newColumnIds };
    });
  };

  /**
   * Move a column down in the current section
   */
  const moveColumnDown = (index: number) => {
    if (index >= currentSection.columnIds.length - 1) return;
    setCurrentSection((section) => {
      const newColumnIds = [...section.columnIds];
      [newColumnIds[index], newColumnIds[index + 1]] = [
        newColumnIds[index + 1],
        newColumnIds[index],
      ];
      return { ...section, columnIds: newColumnIds };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {panelId ? "Edit Panel" : "Create New Panel"}
          </DialogTitle>
          <DialogDescription>
            Configure your data panel with custom sections and columns
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="editor">
                {editingSectionIndex !== null ? "Edit Section" : "Add Section"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="pt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Panel Sections</CardTitle>
                  <CardDescription>
                    Drag to reorder sections. Click edit to modify a section
                    columns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleSectionDragEnd}
                    >
                      <SortableContext
                        items={sections.map((_, index) => `section-${index}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        {sections.map((section, index) => (
                          <SortableSection
                            key={`section-${index}`}
                            section={section}
                            index={index}
                            onEdit={() => handleEditSection(index)}
                            onRemove={() => handleRemoveSection(index)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>

                    {sections.length === 0 && (
                      <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                        No sections added yet. Add a section using the Add
                        Section tab.
                      </div>
                    )}
                  </ScrollArea>

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => {
                        setEditingSectionIndex(null);
                        setCurrentSection({ name: "", columnIds: [] });
                        setActiveTab("editor");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="editor" className="pt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {editingSectionIndex !== null
                      ? "Edit Section"
                      : "Create New Section"}
                  </CardTitle>
                  <CardDescription>
                    Configure section name and select columns to display
                  </CardDescription>
                </CardHeader>
                <CardContent>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Available Columns</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                        }}
                      >
                        <SelectTrigger className="mb-2">
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

                      <ScrollArea className="h-[240px] border rounded-md p-2">
                        {selectedCategory &&
                          columnsByCategory[selectedCategory]?.map((column) => (
                            <SortableColumn
                              key={column.colId}
                              column={column}
                              checked={currentSection.columnIds.includes(
                                column.colId as string,
                              )}
                              onToggle={() =>
                                handleColumnToggle(column.colId as string)
                              }
                            />
                          ))}
                        {!selectedCategory && (
                          <div className="text-center text-muted-foreground p-4">
                            Select a category to view available columns
                          </div>
                        )}
                      </ScrollArea>
                    </div>

                    <div>
                      <div>
                        <Label className="mb-2 block">
                          Selected Columns Order
                        </Label>
                        <ScrollArea className="h-[280px] border rounded-md p-2">
                          {currentSection.columnIds.length > 0 ? (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleColumnDragEnd}
                            >
                              <SortableContext
                                items={currentSection.columnIds.map(
                                  (_, index) => `column-${index}`,
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                {currentSection.columnIds.map((colId, idx) => {
                                  const column = defaultColumns.find(
                                    (col) => col.colId === colId,
                                  );
                                  return (
                                    <SortableColumnItem
                                      key={`column-${idx}`}
                                      column={{
                                        id: colId,
                                        name: column?.headerName || colId,
                                      }}
                                      index={idx}
                                      onRemove={() => handleColumnToggle(colId)}
                                      onMoveUp={() => moveColumnUp(idx)}
                                      onMoveDown={() => moveColumnDown(idx)}
                                      isFirst={idx === 0}
                                      isLast={
                                        idx ===
                                        currentSection.columnIds.length - 1
                                      }
                                    />
                                  );
                                })}
                              </SortableContext>
                            </DndContext>
                          ) : (
                            <div className="text-center text-muted-foreground p-4">
                              No columns selected yet. Select columns from the
                              available columns list.
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSection}
                      disabled={
                        !currentSection.name ||
                        currentSection.columnIds.length === 0
                      }
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {editingSectionIndex !== null
                        ? "Update Section"
                        : "Add Section"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between">
          {panelId && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
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
