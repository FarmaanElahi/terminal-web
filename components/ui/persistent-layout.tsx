"use client";

import {
  LayoutConfig,
  LayoutGroup,
  LayoutItem,
  useLayout,
} from "@/hooks/use-layout";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Screener } from "@/components/screener/screener";
import { Chart } from "@/components/chart/chart";
import { Stats } from "@/components/symbols/symbol_stats";
import { Discussion } from "@/components/stocktwit/discussion";

const ComponentMap = {
  screener: Screener,
  chart: Chart,
  stats: Stats,
  ideas: Discussion,
};

interface PersistentLayoutProps {
  onLayoutChange?: (layout: LayoutConfig) => void;
}

export function PersistentLayout({ onLayoutChange }: PersistentLayoutProps) {
  const { layout, updateItemSize } = useLayout();

  const handleResizeEnd = (id: string, size: number) => {
    updateItemSize(id, size);
    onLayoutChange?.(layout);
  };

  return <LayoutRootComp layout={layout} handleResizeEnd={handleResizeEnd} />;
}

function LayoutRootComp({
  layout,
  handleResizeEnd,
}: {
  layout: LayoutGroup;
  handleResizeEnd: (id: string, size: number) => void;
}) {
  if (layout.id !== "root")
    throw new Error("Layout root should ve have root comp");

  return (
    <ResizablePanelGroup key={layout.id} direction={layout.direction}>
      {layout.children.map((l, index) => (
        <LayoutChildrenComp
          key={l.id}
          index={index}
          handleResizeEnd={handleResizeEnd}
          child={l}
        />
      ))}
    </ResizablePanelGroup>
  );
}

function LayoutChildrenComp({
  index,
  child,
  handleResizeEnd,
}: {
  index: number;
  child: LayoutGroup | LayoutItem;
  handleResizeEnd: (id: string, size: number) => void;
}) {
  return (
    <>
      {index > 0 && <ResizableHandle key={`resize-handle-${index}`} />}
      {isLayoutGroup(child) ? (
        <LayoutGroupComp group={child} handleResizeEnd={handleResizeEnd} />
      ) : (
        <LayoutItemComp item={child} handleResizeEnd={handleResizeEnd} />
      )}
    </>
  );
}

function LayoutGroupComp({
  group,
  handleResizeEnd,
}: {
  group: LayoutGroup;
  handleResizeEnd: (id: string, size: number) => void;
}) {
  return (
    <ResizablePanel key={group.id}>
      <ResizablePanelGroup direction={group.direction}>
        {group.children.map((child, index) => (
          <LayoutChildrenComp
            index={index}
            key={index}
            child={child}
            handleResizeEnd={handleResizeEnd}
          />
        ))}
      </ResizablePanelGroup>
    </ResizablePanel>
  );
}

function LayoutItemComp({
  item,
  handleResizeEnd,
}: {
  item: LayoutItem;
  handleResizeEnd: (id: string, size: number) => void;
}) {
  if (item.visible === false) return null;
  const Component = ComponentMap[item.type];
  if (!Component) return null;

  return (
    <ResizablePanel
      id={item.id}
      defaultSize={item.size}
      className={"h-full"}
      onResize={(size) => handleResizeEnd(item.id, size)}
    >
      <Component id={item.id + item.type} />
    </ResizablePanel>
  );
}

const isLayoutGroup = (item: LayoutItem | LayoutGroup): item is LayoutGroup => {
  return "direction" in item;
};
