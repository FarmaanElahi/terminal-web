// components/symbols/data-panel.tsx
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  defaultColumns,
  extendedColumnType,
} from "@/components/symbols/columns";
import {
  useCreateDataPanel,
  useDataPanels,
  useDeleteDataPanel,
  useSymbolQuote,
  useUpdateDataPanel,
} from "@/lib/state/symbol";
import { ColDef } from "ag-grid-community";
import type { Symbol } from "@/types/symbol";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Edit,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { toast } from "sonner";
import { InsertDataPanel, UpdateDataPanel } from "@/types/supabase";
import { Json } from "@/types/generated/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface DataPanelProps {
  symbol?: string;
  panelId?: string;
  className?: string;
  title?: string;
}

type Section = {
  name: string;
  columnIds: string[];
};

export function DataPanel({
  symbol,
  panelId,
  className,
  title = "Data Panel",
}: DataPanelProps) {
  const { data: symbolData, isLoading, error } = useSymbolQuote(symbol);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { data: dataPanels } = useDataPanels();
  const [selectedPanel, setSelectedPanel] = useState<string | null>(
    panelId || null,
  );

  // Get the panel data if a specific panelId is provided
  const activePanel = useMemo(() => {
    if (!panelId && !selectedPanel) return null;
    return dataPanels?.find((p) => p.id === (selectedPanel || panelId));
  }, [dataPanels, panelId, selectedPanel]);

  // Load sections from the active panel
  useEffect(() => {
    if (activePanel?.sections) {
      const panelSections = activePanel.sections as unknown as Section[];
      setSections(panelSections);

      // Initialize section open states
      const newOpenState: Record<string, boolean> = {};
      panelSections.forEach((section) => {
        newOpenState[section.name] = true;
      });
      setOpenSections(newOpenState);
    }
  }, [activePanel]);

  // Create a column lookup map for quick access
  const columnMap = useMemo(() => {
    return defaultColumns.reduce(
      (acc, col) => {
        if (col.colId) {
          acc[col.colId] = col;
        }
        return acc;
      },
      {} as Record<string, ColDef<Symbol>>,
    );
  }, []);

  // Initialize default sections if none provided
  const displaySections = useMemo(() => {
    if (sections.length > 0) {
      return sections;
    }

    // Default sections matching the screenshot
    return [
      {
        name: "Company Info",
        columnIds: [
          "name",
          "mcap",
          "total_shares_outstanding",
          "sector",
          "industry",
        ],
      },
      {
        name: "Market Cap",
        columnIds: ["mcap"],
      },
      {
        name: "Symbol",
        columnIds: ["name", "RS_10D_pct", "RS_30D_pct", "RS_60D_pct"],
      },
      {
        name: "Industry",
        columnIds: ["industry", "sector", "group", "sub_industry"],
      },
      {
        name: "Earnings Data",
        columnIds: [
          "earnings_release_date",
          "earnings_release_next_date",
          "website",
          "ipo_date",
        ],
      },
      {
        name: "Price and Volume",
        columnIds: [
          "day_close",
          "price_change_today_pct",
          "day_volume",
          "relative_vol_20D",
          "vol_sma_50D",
          "wcr",
          "dcr",
          "high_52_week",
          "up_down_day_20D",
          "run_rate_vol_20D",
        ],
      },
      {
        name: "Momentum & Trend",
        columnIds: [
          "price_change_curr_week_open_pct",
          "RS_rating_1M",
          "RS_rating_3M",
          "RS_rating_12M",
          "stan_weinstein_stage",
          "ADR_pct_20D",
        ],
      },
    ];
  }, [sections]);

  // Toggle function for sections
  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Format value helper function
  const formatValue = (column: ColDef<Symbol>, value: unknown) => {
    if (!symbolData) return "-";

    // Handle cell renderer cases
    if (column.cellRenderer) {
      // If it's a Boolean cell
      if (column.cellRenderer === "BooleanCell") {
        return value ? (
          <Check className="h-4 w-4 text-bullish" />
        ) : (
          <X className="h-4 w-4 text-bearish" />
        );
      }

      // For logo text cells and other complex renderers, fallback to basic formatting
      if (typeof value === "boolean") {
        return value ? (
          <Check className="h-4 w-4 text-bullish" />
        ) : (
          <X className="h-4 w-4 text-bearish" />
        );
      }
    }

    // Handle data type formatting based on cellDataType
    if (column.cellDataType && typeof column.cellDataType === "string") {
      const dataType = column.cellDataType as string;
      const formatter =
        extendedColumnType[dataType as keyof typeof extendedColumnType];

      if (formatter && formatter.valueFormatter) {
        return formatter.valueFormatter({
          value,
          data: symbolData,
          colDef: column,
          api: null,
          column: null,
          columnApi: null,
          context: null,
          node: null,
        }) as string;
      }
    }

    // Use valueFormatter if available
    if (column.valueFormatter && typeof column.valueFormatter === "function") {
      return column.valueFormatter({
        value,
        data: symbolData,
        colDef: column,
        api: null,
        column: null,
        columnApi: null,
        context: null,
        node: null,
      }) as string;
    }

    // Default display
    return value !== undefined && value !== null ? String(value) : "-";
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full h-full border rounded-none p-0 flex flex-col",
          className,
        )}
      >
        <div className="border-b p-2 flex justify-between items-center bg-muted/20">
          <div className="text-sm font-medium">{title}</div>
        </div>
        <div className="overflow-auto flex-1 p-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between py-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error || !symbolData) {
    return (
      <div
        className={cn(
          "w-full h-full border rounded-none p-0 flex flex-col",
          className,
        )}
      >
        <div className="border-b p-2 flex justify-between items-center bg-muted/20">
          <div className="text-sm font-medium">{title}</div>
        </div>
        <div className="overflow-auto flex-1 p-4">
          <div className="text-destructive">Error loading symbol data</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full border rounded-none p-0 flex flex-col",
        className,
      )}
    >
      <div className="border-b p-2 flex justify-between items-center bg-muted/20">
        <div className="text-sm font-medium">{activePanel?.name || title}</div>
        <div className="flex items-center gap-2">
          {symbol && (
            <span className="text-xs text-muted-foreground">{symbol}</span>
          )}
          <DataPanelSelector
            selectedPanel={selectedPanel}
            setSelectedPanel={setSelectedPanel}
            setOpenDialog={setOpenDialog}
          />
          {activePanel && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpenEditDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="grid gap-2">
                <div className="text-sm font-medium">Visible Sections</div>
                <div className="grid gap-1">
                  {displaySections.map((section) => (
                    <div key={section.name} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start font-normal w-full text-left"
                        onClick={() => toggleSection(section.name)}
                      >
                        {section.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        {displaySections.map((section) => {
          // Get all valid columns for this section
          const sectionColumns = section.columnIds
            .map((id) => columnMap[id])
            .filter(Boolean);

          if (sectionColumns.length === 0) return null;

          return (
            <Collapsible
              key={section.name}
              open={openSections[section.name]}
              onOpenChange={() => toggleSection(section.name)}
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-muted/50 hover:bg-muted/70 text-xs font-medium text-muted-foreground">
                {section.name}
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", {
                    "transform rotate-180": openSections[section.name],
                  })}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {sectionColumns.map((column) => {
                  const field = column.field as keyof Symbol;
                  const value = symbolData[field];

                  // Determine if value should be colored
                  const isNumeric = typeof value === "number";
                  const isPositive = isNumeric && value > 0;
                  const isNegative = isNumeric && value < 0;
                  const shouldColorize =
                    column.cellClass && typeof column.cellClass === "function";

                  return (
                    <div
                      key={column.colId}
                      className="flex justify-between items-center px-4 py-1.5 border-t first:border-t-0 text-sm hover:bg-muted/30"
                    >
                      <span className="text-muted-foreground">
                        {column.headerName}
                      </span>
                      <span
                        className={cn({
                          "text-bullish font-medium":
                            isPositive && shouldColorize,
                          "text-bearish font-medium":
                            isNegative && shouldColorize,
                          "font-medium":
                            column.field === "name" || column.colId === "name",
                        })}
                      >
                        {formatValue(column, value)}
                      </span>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Create New Panel Dialog */}
      <DataPanelCreator
        open={openDialog}
        setOpen={setOpenDialog}
        initialSections={sections}
        panelId={activePanel?.id}
        panelName={activePanel?.name}
      />

      {/* Edit Panel Dialog */}
      {activePanel && (
        <DataPanelEditor
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          panelId={activePanel.id}
          panelName={activePanel.name}
          initialSections={sections}
        />
      )}
    </div>
  );
}

interface DataPanelSelectorProps {
  selectedPanel: string | null;
  setSelectedPanel: (id: string | null) => void;
  setOpenDialog: (open: boolean) => void;
}

function DataPanelSelector({
  selectedPanel,
  setSelectedPanel,
  setOpenDialog,
}: DataPanelSelectorProps) {
  const { data: dataPanels } = useDataPanels();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1">
          <span className="text-xs">Panels</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Select Panel</div>
          <div className="grid gap-1">
            {dataPanels?.map((panel) => (
              <Button
                key={panel.id}
                variant={selectedPanel === panel.id ? "default" : "ghost"}
                size="sm"
                className="h-7 justify-start font-normal w-full text-left"
                onClick={() => setSelectedPanel(panel.id)}
              >
                {panel.name}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 justify-start font-normal w-full text-left mt-2"
              onClick={() => setOpenDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Panel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DataPanelCreatorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialSections?: Section[];
  panelId?: string;
  panelName?: string;
}

function DataPanelCreator({
  open,
  setOpen,
  initialSections = [],
  panelId,
  panelName,
}: DataPanelCreatorProps) {
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
    const grouped: Record<string, ColDef<Symbol>[]> = {};
    defaultColumns.forEach((col) => {
      const category = (col.context?.category as string) || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(col);
    });
    return grouped;
  }, []);

  const handleAddSection = () => {
    if (!currentSection.name || currentSection.columnIds.length === 0) {
      toast.error("Section name and at least one column are required");
      return;
    }

    setSections((prev) => [...prev, { ...currentSection }]);
    setCurrentSection({ name: "", columnIds: [] });
  };

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

  const handleRemoveSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

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
                    <Trash className="h-4 w-4" />
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
                    {Object.entries(columnsByCategory).map(
                      ([category, columns]) => (
                        <Fragment key={category}>
                          {columns.map((column) => (
                            <div
                              key={column.colId}
                              className="flex items-center"
                            >
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
                        </Fragment>
                      ),
                    )}
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

interface DataPanelEditorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  panelId: string;
  panelName: string;
  initialSections: Section[];
}

function DataPanelEditor({
  open,
  setOpen,
  panelId,
  panelName,
  initialSections,
}: DataPanelEditorProps) {
  const [name, setName] = useState(panelName);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingSection, setEditingSection] = useState<{
    index: number;
    section: Section | null;
  }>({ index: -1, section: null });
  const [confirmDeleteSection, setConfirmDeleteSection] = useState<
    number | null
  >(null);
  const [, setAvailableCategories] = useState<string[]>([]);
  const updateDataPanel = useUpdateDataPanel();
  const deleteDataPanel = useDeleteDataPanel();
  const [confirmDeletePanel, setConfirmDeletePanel] = useState(false);

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
    const grouped: Record<string, ColDef<Symbol>[]> = {};
    defaultColumns.forEach((col) => {
      const category = (col.context?.category as string) || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(col);
    });
    return grouped;
  }, []);

  // Get column lookup for display
  const columnMap = useMemo(() => {
    return defaultColumns.reduce(
      (acc, col) => {
        if (col.colId) {
          acc[col.colId] = col;
        }
        return acc;
      },
      {} as Record<string, ColDef<Symbol>>,
    );
  }, []);

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

  const startEditSection = (index: number) => {
    setEditingSection({
      index,
      section: { ...sections[index] },
    });
  };

  const cancelEditSection = () => {
    setEditingSection({ index: -1, section: null });
  };

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

  const addNewSection = () => {
    setEditingSection({
      index: sections.length,
      section: { name: "", columnIds: [] },
    });
  };

  const handleDeleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    setConfirmDeleteSection(null);
  };

  const toggleColumnInEditingSection = (colId: string) => {
    if (!editingSection.section) return;

    setEditingSection((prev) => {
      if (!prev.section) return prev;

      const exists = prev.section.columnIds.includes(colId);
      let updatedColumnIds;

      if (exists) {
        updatedColumnIds = prev.section.columnIds.filter((id) => id !== colId);
      } else {
        updatedColumnIds = [...prev.section.columnIds, colId];
      }

      return {
        ...prev,
        section: {
          ...prev.section,
          columnIds: updatedColumnIds,
        },
      };
    });
  };

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
                  <Plus className="h-3.5 w-3.5 mr-1" />
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

                    <div className="mt-2">
                      <h5 className="text-sm font-medium mb-2">
                        Selected Columns (
                        {editingSection.section.columnIds.length})
                      </h5>
                      <div className="border rounded-md p-2 max-h-32 overflow-y-auto mb-4">
                        {editingSection.section.columnIds.length > 0 ? (
                          <div className="space-y-1">
                            {editingSection.section.columnIds.map((colId) => {
                              const column = columnMap[colId];
                              return column ? (
                                <div
                                  key={colId}
                                  className="flex items-center justify-between py-1 px-2 hover:bg-muted/30 rounded-sm"
                                >
                                  <span className="text-sm">
                                    {column.headerName}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() =>
                                        toggleColumnInEditingSection(colId)
                                      }
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground p-2 text-center">
                            No columns selected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2">
                      <h5 className="text-sm font-medium mb-2">
                        Available Columns
                      </h5>
                      <Accordion
                        type="multiple"
                        className="max-h-64 overflow-y-auto border rounded-md"
                      >
                        {Object.entries(columnsByCategory).map(
                          ([category, columns]) => (
                            <AccordionItem value={category} key={category}>
                              <AccordionTrigger className="px-3 py-2 text-sm">
                                {category}
                              </AccordionTrigger>
                              <AccordionContent className="px-3 py-0">
                                <div className="space-y-1 pb-2">
                                  {columns.map((column) => (
                                    <div
                                      key={column.colId}
                                      className="flex items-center py-1"
                                    >
                                      <Checkbox
                                        id={`col-edit-${column.colId}`}
                                        checked={editingSection.section?.columnIds.includes(
                                          column.colId as string,
                                        )}
                                        onCheckedChange={() =>
                                          toggleColumnInEditingSection(
                                            column.colId as string,
                                          )
                                        }
                                        className="mr-2"
                                      />
                                      <label
                                        htmlFor={`col-edit-${column.colId}`}
                                        className="text-sm cursor-pointer"
                                      >
                                        {column.headerName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ),
                        )}
                      </Accordion>
                    </div>

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
