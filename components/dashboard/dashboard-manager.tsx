// components/dashboard/dashboard-manager.tsx
import React, { useEffect, useState } from "react";
import { Dashboard } from "./dashboard";
import { toast } from "sonner";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  useCreateDashboard,
  useDashboards,
  useDeleteDashboard,
} from "@/lib/state/symbol";
import { Json } from "@/types/generated/supabase";
import { LayoutItem } from "@/components/dashboard/use-dashboard";
import { DashboardSelector } from "@/components/dashboard/dashboard-selector";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

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
  const { data: dashboards = [], isLoading } = useDashboards();

  const { mutate: createDashboard } = useCreateDashboard();
  const { mutate: deleteDashboard } = useDeleteDashboard();

  // Keep using localStorage for open tabs and active dashboard (UI state)
  const [activeDashboardId, setActiveDashboardId] = useLocalStorage<string>(
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
    if (activeDashboardId && !openTabs.includes(activeDashboardId)) {
      setOpenTabs([...openTabs, activeDashboardId]);
    }
  }, [activeDashboardId, openTabs, setOpenTabs]);

  // Set initial active dashboard if we have dashboards but no active one
  useEffect(() => {
    if (dashboards.length > 0 && !activeDashboardId) {
      setActiveDashboardId(dashboards[0].id);
    }
  }, [dashboards, activeDashboardId, setActiveDashboardId]);

  const handleCreateDashboard = (name: string, layouts: LayoutItem[]) => {
    createDashboard(
      { name, layout: layouts as unknown as Json },
      {
        onSuccess: (newDashboard) => {
          setActiveDashboardId(newDashboard.id);
          // Add new dashboard to tabs
          setOpenTabs([...openTabs, newDashboard.id]);
          toast(`Dashboard ${name} created`);
        },
        onError: (error) => {
          console.error("Error creating dashboard:", error);
          toast.error("Failed to create dashboard");
        },
      },
    );
  };

  const handleDeleteDashboard = (id: string) => {
    const dashboard = dashboards.find((d) => d.id === id);

    deleteDashboard(id, {
      onSuccess: () => {
        // Remove from open tabs
        setOpenTabs(openTabs.filter((tabId) => tabId !== id));

        if (activeDashboardId === id) {
          // Set the active dashboard to the last open tab, or empty if none
          const remainingTabs = openTabs.filter((tabId) => tabId !== id);
          setActiveDashboardId(
            remainingTabs.length > 0
              ? remainingTabs[remainingTabs.length - 1]
              : "",
          );
        }
        toast(`Dashboard ${dashboard?.name} deleted`);
      },
      onError: (error) => {
        console.error("Error deleting dashboard:", error);
        toast.error("Failed to delete dashboard");
      },
    });
  };

  const handleTabClose = (id: string) => {
    setOpenTabs(openTabs.filter((tabId) => tabId !== id));

    if (activeDashboardId === id) {
      // Set the active dashboard to the last open tab, or empty if none
      const remainingTabs = openTabs.filter((tabId) => tabId !== id);
      setActiveDashboardId(
        remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : "",
      );
    }
  };

  const handleDashboardSelect = (id: string) => {
    setActiveDashboardId(id);

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

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading dashboards...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        <DashboardSelector
          dashboards={dashboards}
          activeDashboard={activeDashboardId}
          setActiveDashboard={handleDashboardSelect}
          onCreateDashboard={handleCreateDashboard}
          onDeleteDashboard={handleDeleteDashboard}
          onAddWidget={() => setIsAddingWidget(true)}
          canAddWidget={!!activeDashboard}
        />

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
                        isActive={activeDashboardId === dashboard.id}
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

      {/* Tabs beside Add Widget button */}

      {activeDashboard && (
        <Dashboard
          className="flex-1"
          key={activeDashboard.id}
          id={activeDashboard.id}
          name={activeDashboard.name}
          isAddingWidget={isAddingWidget}
          onAddingWidgetChange={setIsAddingWidget}
        />
      )}
    </div>
  );
}
