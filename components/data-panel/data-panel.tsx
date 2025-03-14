// components/symbols/data-panel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultColumns,
  extendedColumnType,
} from "@/components/symbols/columns";
import { useDataPanels, useSymbolQuote } from "@/lib/state/symbol";
import { ColDef } from "ag-grid-community";
import type { Symbol } from "@/types/symbol";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Edit, Settings, X } from "lucide-react";
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
import { DataPanelEditor } from "./panel-editor";
import { useActiveDataPanelId } from "@/hooks/use-active-data-panel";
import { useGroupSymbol } from "@/lib/state/grouper";

interface DataPanelProps {
  panelId?: string;
  className?: string;
  title?: string;
}

type Section = {
  name: string;
  columnIds: string[];
};

export function DataPanel({
  panelId,
  className,
  title = "Data Panel",
  ...props
}: DataPanelProps) {
  const symbol = useGroupSymbol() ?? "NSE:RELIANCE";
  const { data: symbolData, isLoading, error } = useSymbolQuote(symbol);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { data: dataPanels } = useDataPanels();
  const { activeDataPanelId, setActiveDataPanelId } = useActiveDataPanelId();

  // Set initial panel ID from props if provided
  useEffect(() => {
    if (panelId && !activeDataPanelId) {
      setActiveDataPanelId(panelId);
    }
  }, [panelId, activeDataPanelId, setActiveDataPanelId]);

  // Get the panel data if a specific panel ID is provided
  const activePanel = useMemo(() => {
    if (!activeDataPanelId) return null;
    return dataPanels?.find((p) => p.id === activeDataPanelId);
  }, [dataPanels, activeDataPanelId]);

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
      {...props}
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

      {/* Edit Panel Dialog */}
      {activePanel && openEditDialog && (
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
