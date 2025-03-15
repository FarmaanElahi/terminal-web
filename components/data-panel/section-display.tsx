"use client";

import { useMemo } from "react";
import { ColDef, Column, GridApi } from "ag-grid-community";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { defaultColumns, extendedColumnType } from "@/components/symbols/columns";
import type { Section } from "./types";
import { Symbol } from "@/types/symbol";

/**
 * Displays data panel sections with symbol data
 *
 * @param sections - Array of section configurations
 * @param openSections - Record of which sections are open/closed
 * @param toggleSection - Function to toggle section open/closed state
 * @param symbolData - Symbol data to display in the panel
 */
export function DataPanelSectionDisplay({
  sections,
  openSections,
  toggleSection,
  symbolData,
}: {
  sections: Section[];
  openSections: Record<string, boolean>;
  toggleSection: (sectionName: string) => void;
  symbolData: Symbol;
}) {
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

    // Default sections
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
      // Add other default sections here...
    ];
  }, [sections]);

  /**
   * Format value helper function to display cell values properly
   */
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any) as string;
      }
    }

    // Use valueFormatter if available
    if (column.valueFormatter && typeof column.valueFormatter === "function") {
      return column.valueFormatter({
        value,
        data: symbolData,
        colDef: column,
        api: null as unknown as GridApi,
        column: null as unknown as  Column,
        context: null,
        node: null,
      }) as string;
    }

    // Default display
    return value !== undefined && value !== null ? String(value) : "-";
  };

  return (
    <>
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
    </>
  );
}
