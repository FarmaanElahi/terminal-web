// components/symbols/data-panel/index.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDataPanels, useSymbolQuote } from "@/lib/state/symbol";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./types";
import { DataPanelSectionDisplay } from "./section-display";
import { DataPanelSelector } from "./panel-selector";
import { DataPanelCreator } from "./panel-creator";
import { DataPanelEditor } from "./panel-editor";
import { DataPanelSettings } from "./panel-settings";

/**
 * DataPanel component displays financial data for a stock symbol in a customizable panel format.
 *
 * @param symbol - The stock symbol to display data for
 * @param panelId - Optional ID of a specific panel configuration to use
 * @param className - Optional CSS class names
 * @param title - Optional panel title (defaults to "Data Panel")
 */
export function DataPanel({
  symbol,
  panelId,
  className,
  title = "Data Panel",
}: {
  symbol?: string;
  panelId?: string;
  className?: string;
  title?: string;
}) {
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

  // Toggle function for sections
  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Display loading state while data is loading
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

  // Display error state if data loading fails
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
          <DataPanelSettings
            displaySections={sections}
            toggleSection={toggleSection}
          />
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <DataPanelSectionDisplay
          sections={sections}
          openSections={openSections}
          toggleSection={toggleSection}
          symbolData={symbolData}
        />
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
