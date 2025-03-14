// components/symbols/data-panel.tsx
"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
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

      <DataPanelCreator
        open={openDialog}
        setOpen={setOpenDialog}
        initialSections={sections}
        panelId={activePanel?.id}
        panelName={activePanel?.name}
      />
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
