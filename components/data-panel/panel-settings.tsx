"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { Section } from "./types";

/**
 * Settings component for the data panel, allowing configuration of visible sections
 *
 * @param displaySections - Sections to display in the settings
 * @param toggleSection - Function to toggle section visibility
 */
export function DataPanelSettings({
  displaySections,
  toggleSection,
}: {
  displaySections: Section[];
  toggleSection: (sectionName: string) => void;
}) {
  return (
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
  );
}
