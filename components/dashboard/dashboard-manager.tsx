// components/dashboard/dashboard-manager.tsx
import React, { useEffect, useState } from "react";
import { DashboardSelector } from "./dashboard-selector";
import { Dashboard } from "./dashboard";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { DEFAULT_LAYOUT } from "@/components/dashboard/widget-registry";
import type { LayoutItem } from "./use-dashboard";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

export interface DashboardConfig {
  id: string;
  name: string;
  layouts: LayoutItem[];
}

interface TabItemProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

const TabItem = ({ id, name, isActive, onSelect, onClose }: TabItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "inline-flex items-center h-8 px-3 py-1 text-sm cursor-pointer select-none touch-none relative text-secondary-foreground font-bold",
        isActive
          ? "bg-background border-b-2 border-primary"
          : "hover:bg-muted/60 border-b-2 border-transparent",
        isDragging ? "opacity-70" : "opacity-100",
        "min-w-[100px] max-w-[150px]",
      )}
      onClick={() => onSelect(id)}
    >
      <span className="flex-1 truncate text-center">{name}</span>
      <button
        className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20"
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export function DashboardManager() {
  const [dashboards, setDashboards] = useLocalStorage<DashboardConfig[]>(
    "dashboards",
    [],
  );
  const [activeDashboard, setActiveDashboard] = useLocalStorage<string>(
    "active-dashboard",
    "",
  );
  const [openTabs, setOpenTabs] = useLocalStorage<string[]>(
    "open-dashboard-tabs",
    [],
  );
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  // Configure dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px of movement required before activation
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Ensure the active dashboard is in the open tabs
  useEffect(() => {
    if (activeDashboard && !openTabs.includes(activeDashboard)) {
      setOpenTabs([...openTabs, activeDashboard]);
    }
  }, [activeDashboard, openTabs, setOpenTabs]);

  const handleCreateDashboard = (name: string) => {
    const newDashboard: DashboardConfig = {
      id: `dashboard-${Date.now()}`,
      name,
      layouts: DEFAULT_LAYOUT,
    };
    setDashboards([...dashboards, newDashboard]);
    setActiveDashboard(newDashboard.id);
    // Add new dashboard to tabs
    setOpenTabs([...openTabs, newDashboard.id]);
    toast(`Dashboard ${name} created`);
  };

  const handleDeleteDashboard = (id: string) => {
    const dashboard = dashboards.find((d) => d.id === id);
    setDashboards(dashboards.filter((d) => d.id !== id));

    // Remove from open tabs
    setOpenTabs(openTabs.filter((tabId) => tabId !== id));

    if (activeDashboard === id) {
      // Set the active dashboard to the last open tab, or empty if none
      const remainingTabs = openTabs.filter((tabId) => tabId !== id);
      setActiveDashboard(
        remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : "",
      );
    }

    toast(`Dashboard ${dashboard?.name} deleted`);
  };

  const handleTabClose = (id: string) => {
    setOpenTabs(openTabs.filter((tabId) => tabId !== id));

    if (activeDashboard === id) {
      // Set the active dashboard to the last open tab, or empty if none
      const remainingTabs = openTabs.filter((tabId) => tabId !== id);
      setActiveDashboard(
        remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : "",
      );
    }
  };

  const handleDashboardSelect = (id: string) => {
    setActiveDashboard(id);

    // Add to open tabs if not already there
    if (!openTabs.includes(id)) {
      setOpenTabs([...openTabs, id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the indices of the tabs being dragged
    const activeIndex = openTabs.indexOf(active.id as string);
    const overIndex = openTabs.indexOf(over.id as string);

    // Create a new array with the reordered tabs
    const newOpenTabs = [...openTabs];
    const [movedItem] = newOpenTabs.splice(activeIndex, 1);
    newOpenTabs.splice(overIndex, 0, movedItem);

    setOpenTabs(newOpenTabs);
  };

  const activeDashboardConfig = dashboards.find(
    (d) => d.id === activeDashboard,
  );

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <div className="flex flex-col sm:flex-row">
          <div className="flex items-center flex-shrink-0 mb-2 sm:mb-0">
            <DashboardSelector
              dashboards={dashboards}
              activeDashboard={activeDashboard}
              setActiveDashboard={handleDashboardSelect}
              onCreateDashboard={handleCreateDashboard}
              onDeleteDashboard={handleDeleteDashboard}
              onAddWidget={() => setIsAddingWidget(true)}
              canAddWidget={!!activeDashboardConfig}
            />
          </div>

          {/* Tabs beside Add Widget button */}
          <div className="ml-0 sm:ml-6 overflow-x-auto">
            {openTabs.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
              >
                <SortableContext
                  items={openTabs}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex h-full items-center">
                    {openTabs.map((tabId) => {
                      const dashboard = dashboards.find((d) => d.id === tabId);
                      if (!dashboard) return null;

                      return (
                        <TabItem
                          key={dashboard.id}
                          id={dashboard.id}
                          name={dashboard.name}
                          isActive={activeDashboard === dashboard.id}
                          onSelect={handleDashboardSelect}
                          onClose={handleTabClose}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeDashboardConfig && (
          <Dashboard
            key={activeDashboardConfig.id}
            id={activeDashboardConfig.id}
            name={activeDashboardConfig.name}
            isAddingWidget={isAddingWidget}
            onAddingWidgetChange={setIsAddingWidget}
          />
        )}
      </div>
    </div>
  );
}
