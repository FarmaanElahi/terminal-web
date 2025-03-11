import {
  Check,
  ChevronsUpDown,
  Copy,
  Layout as LayoutIcon,
  Loader2,
  Plus,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dashboard } from "@/types/supabase";
import type { LayoutItem } from "@/components/dashboard/use-dashboard";

interface DashboardSelectorProps {
  dashboards: Dashboard[];
  activeDashboard?: string;
  setActiveDashboard: (id: string) => void;
  onCreateDashboard: (name: string, layouts: LayoutItem[]) => void;
  onDeleteDashboard: (id: string) => void;
  onAddWidget: () => void;
  canAddWidget: boolean;
}

export function DashboardSelector({
  dashboards,
  activeDashboard,
  setActiveDashboard,
  onCreateDashboard,
  onDeleteDashboard,
  onAddWidget,
  canAddWidget,
}: DashboardSelectorProps) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDashboardDefault, setNewDashboardDefault] = useState<string>();
  const activeDashboardConfig = dashboards.find(
    (d) => d.id === activeDashboard,
  );

  return (
    <div className="flex gap-1 p-2">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="rounded-md border">
          <PopoverTrigger asChild className="border-none">
            <Button
              variant="outline"
              role="combobox"
              size="sm"
              aria-expanded={open}
              className="w-[160px] justify-between font-bold"
            >
              <div className="flex items-center">
                <LayoutIcon className="mr-2 h-4 w-4" />
                {activeDashboardConfig?.name || "Dashboards"}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <Button
            className="border-none font-bold"
            variant="outline"
            size="sm"
            onClick={() => {
              setNewDashboardDefault(undefined);
              setOpenDialog(true);
            }}
          >
            <Plus className="size-4" />
            Add Dashboard
          </Button>
        </div>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search dashboards..." className="h-9" />
            <CommandList>
              <CommandEmpty>No dashboard found.</CommandEmpty>
              <CommandGroup>
                {dashboards.map((dashboard) => (
                  <CommandItem
                    key={dashboard.id}
                    className="font-bold group relative"
                    value={dashboard.id}
                    onSelect={(currentValue) => {
                      setActiveDashboard(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        activeDashboard === dashboard.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{dashboard.name}</span>
                    <Button
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewDashboardDefault(`${dashboard.name} (Copy)`);
                        setOpenDialog(true);
                      }}
                    >
                      <Copy size="3" />
                    </Button>
                    <DeleteDashboard
                      dashboard={dashboard}
                      onDelete={onDeleteDashboard}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-7 w-7"
                        onClick={(e) => {
                          // Stop the click from bubbling up to the CommandItem
                          e.stopPropagation();
                        }}
                      >
                        <Trash size="3" />
                      </Button>
                    </DeleteDashboard>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {activeDashboardConfig && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddWidget}
          disabled={!canAddWidget}
        >
          <Plus className="size-4" />
        </Button>
      )}

      <DashboardCreatorDialog
        open={openDialog}
        setOpen={setOpenDialog}
        defaultName={newDashboardDefault}
        onCreate={(name) => onCreateDashboard(name, [])}
      />
    </div>
  );
}

function DashboardCreatorDialog({
  open,
  setOpen,
  defaultName,
  onCreate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultName?: string;
  onCreate: (name: string) => void;
}) {
  const [dashboardName, setDashboardName] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => setDashboardName(defaultName), [defaultName]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultName ? "Clone Dashboard" : "Create New Dashboard"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <Input
              id="name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Enter dashboard name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!dashboardName || isPending}
            onClick={() => {
              setIsPending(true);
              onCreate(dashboardName!);
              setIsPending(false);
              setOpen(false);
            }}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultName ? "Clone" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDashboard({
  dashboard,
  onDelete,
  children,
}: {
  dashboard: Dashboard;
  onDelete: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-destructive">
              {" "}
              {dashboard.name}
            </span>{" "}
            dashboard
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={(e) => {
              // Stop click from bubbling
              e.stopPropagation();
              onDelete(dashboard.id);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
