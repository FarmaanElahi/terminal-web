// components/symbols/data-panel/data-panel-selector.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDataPanels } from "@/lib/state/symbol";
import { Plus } from "lucide-react";

/**
 * Panel selector component allows switching between different saved panel configurations
 *
 * @param selectedPanel - Currently selected panel ID
 * @param setSelectedPanel - Function to update the selected panel
 * @param setOpenDialog - Function to open the panel creator dialog
 */
export function DataPanelSelector({
  selectedPanel,
  setSelectedPanel,
  setOpenDialog,
}: {
  selectedPanel: string | null;
  setSelectedPanel: (id: string | null) => void;
  setOpenDialog: (open: boolean) => void;
}) {
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
