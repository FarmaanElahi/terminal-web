// components/data-panel/data-panel.tsx
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
import { Check, ChevronDown, Edit, PanelRight, Search, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// Panel selector component when no panel is active
function PanelSelector({ title }: { title: string }) {
  return (
    <>
      <div className="p-2 flex justify-between items-center bg-muted/20 rounded-t-md">
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center mb-6">
          <PanelRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Select a Data Panel</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Choose an existing panel or create a new one to view symbol data
          </p>
        </div>
      </div>
    </>
  );
}

// Empty panel prompt component
function EmptyPanelPrompt() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center mb-6">
        <Edit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Empty Panel Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This panel has no sections or columns configured
        </p>
      </div>
    </div>
  );
}

// No symbol selected prompt
function NoSymbolPrompt() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center mb-6">
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Select a Symbol</h3>
        <p className="text-sm text-muted-foreground">
          Use the symbol search or group selector to choose a symbol.
        </p>
      </div>
    </div>
  );
}

// Loading state component
function LoadingState({
  panelName,
  title,
  symbol,
}: {
  panelName?: string;
  title: string;
  symbol: string;
}) {
  return (
    <>
      <div className="p-2 flex justify-between items-center bg-muted/20 rounded-t-md">
        <div className="text-sm font-medium">{panelName || title}</div>
        <span className="text-xs text-muted-foreground">{symbol}</span>
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
    </>
  );
}

// Error state component
function ErrorState({ symbol }: { symbol: string }) {
  return (
    <div className="overflow-auto flex-1 p-4">
      <div className="text-destructive">
        Error loading symbol data for {symbol}
      </div>
    </div>
  );
}

// Section column item component
function ColumnItem({
  column,
  value,
  symbolData,
  isLast,
}: {
  column: ColDef<Symbol>;
  value: unknown;
  symbolData: Symbol;
  columnMap: Record<string, ColDef<Symbol>>;
  isLast?: boolean;
}) {
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
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return formatter.valueFormatter({
          value,
          data: symbolData,
          colDef: column,
          api: null,
          column: null,
          columnApi: null,
          context: null,
          node: null,
        } as any) as string;
      }
    }

    // Use valueFormatter if available
    if (column.valueFormatter && typeof column.valueFormatter === "function") {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return column.valueFormatter({
        value,
        data: symbolData,
        colDef: column,
        api: null,
        column: null,
        columnApi: null,
        context: null,
        node: null,
      } as any) as string;
    }

    if (typeof value === "number") {
      return (
        (extendedColumnType["number"]?.valueFormatter?.({
          value,
          data: symbolData,
          colDef: column,
          api: null,
          column: null,
          columnApi: null,
          context: null,
          node: null,
        } as any) as string) ?? "-"
      );
    }

    // Default display
    return value !== undefined && value !== null ? String(value) : "-";
  };

  // Determine if value should be colored
  const isNumeric = typeof value === "number";
  const isPositive = isNumeric && value > 0;
  const isNegative = isNumeric && value < 0;
  const shouldColorize =
    column.cellClass && typeof column.cellClass === "function";

  return (
    <div
      key={column.colId}
      className={cn(
        "flex justify-between items-center px-4 py-1.5 border-t first:border-t-0 text-sm hover:bg-muted/30",
        { "rounded-b-md": isLast },
      )}
    >
      <span className="font-bold">{column.headerName}</span>
      <span
        className={cn("font-medium", {
          "text-bullish": isPositive && shouldColorize,
          "text-bearish": isNegative && shouldColorize,
        })}
      >
        {formatValue(column, value)}
      </span>
    </div>
  );
}

// Panel section component
function PanelSection({
  section,
  isOpen,
  onToggle,
  columnMap,
  symbolData,
}: {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
  columnMap: Record<string, ColDef<Symbol>>;
  symbolData: Symbol;
}) {
  // Get all valid columns for this section
  const sectionColumns = section.columnIds
    .map((id) => columnMap[id])
    .filter(Boolean);

  if (sectionColumns.length === 0) return null;

  return (
    <Collapsible
      key={section.name}
      open={isOpen}
      onOpenChange={onToggle}
      className={cn("mb-1", {
        "border rounded-md shadow-sm": true,
      })}
    >
      <CollapsibleTrigger
        className={cn(
          "w-full flex items-center justify-between p-2 text-xs font-bold text-muted-foreground",
          "rounded-t-md bg-muted/60 hover:bg-muted transition-colors",
          { "rounded-b-md": !isOpen },
        )}
      >
        {section.name}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", {
            "transform rotate-180": isOpen,
          })}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-background rounded-b-md overflow-hidden">
        {sectionColumns.map((column, index) => {
          const field = column.field as keyof Symbol;
          const value = symbolData[field];
          const isLast = index === sectionColumns.length - 1;

          return (
            <ColumnItem
              key={column.colId?.toString()}
              column={column}
              value={value}
              symbolData={symbolData}
              columnMap={columnMap}
              isLast={isLast}
            />
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Main Data Panel Component
export function DataPanel({
  panelId,
  className,
  title = "Data Panel",
  ...props
}: DataPanelProps) {
  const symbol = useGroupSymbol() ?? "";
  const { data: symbolData, isLoading, error } = useSymbolQuote(symbol);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [sections, setSections] = useState<Section[]>([]);
  const { data: dataPanels, isLoading: isLoadingPanels } = useDataPanels();
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
    } else {
      setSections([]);
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

  // Check if panel has valid content
  const hasPanelContent = useMemo(() => {
    if (!sections || sections.length === 0) return false;

    // Check if at least one section has valid columns
    return sections.some((section) => {
      const validColumns = section.columnIds
        .map((id) => columnMap[id])
        .filter(Boolean);
      return validColumns.length > 0;
    });
  }, [sections, columnMap]);

  // Toggle function for sections
  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Render based on various states
  if (!activeDataPanelId && !isLoadingPanels) {
    // No panel selected
    return (
      <div
        {...props}
        className={cn(
          "w-full h-full flex flex-col rounded-md border",
          className,
        )}
      >
        <PanelSelector title={title} />
      </div>
    );
  }

  if (activePanel && !hasPanelContent) {
    // Panel is selected but has no content
    return (
      <div
        {...props}
        className={cn(
          "w-full h-full flex flex-col rounded-md border",
          className,
        )}
      >
        <div className="p-2 flex justify-between items-center bg-muted/20 rounded-t-md">
          <div className="text-sm font-medium">{activePanel.name || title}</div>
        </div>
        <EmptyPanelPrompt />
      </div>
    );
  }

  if (!symbol) {
    // No symbol selected
    return (
      <div
        {...props}
        className={cn(
          "w-full h-full flex flex-col rounded-md border",
          className,
        )}
      >
        <div className="p-2 flex justify-between items-center bg-muted/20 rounded-t-md">
          <div className="text-sm font-medium">
            {activePanel?.name || title}
          </div>
        </div>
        <NoSymbolPrompt />
      </div>
    );
  }

  if (isLoading) {
    // Loading state
    return (
      <div
        {...props}
        className={cn(
          "w-full h-full flex flex-col rounded-md border",
          className,
        )}
      >
        <LoadingState
          panelName={activePanel?.name}
          title={title}
          symbol={symbol}
        />
      </div>
    );
  }

  if (error || !symbolData) {
    // Error state
    return (
      <div
        {...props}
        className={cn(
          "w-full h-full flex flex-col rounded-md border",
          className,
        )}
      >
        <div className="p-2 flex justify-between items-center bg-muted/20 rounded-t-md">
          <div className="text-sm font-medium">
            {activePanel?.name || title}
          </div>
          <span className="text-xs text-muted-foreground">{symbol}</span>
        </div>
        <ErrorState symbol={symbol} />
      </div>
    );
  }

  // Normal data display state
  return (
    <div
      {...props}
      className={cn("w-full h-full flex flex-col rounded-md", className)}
    >
      <div className="overflow-auto flex-1 p-1">
        {sections.map((section) => (
          <PanelSection
            key={section.name}
            section={section}
            isOpen={openSections[section.name] || false}
            onToggle={() => toggleSection(section.name)}
            columnMap={columnMap}
            symbolData={symbolData}
          />
        ))}
      </div>
    </div>
  );
}
