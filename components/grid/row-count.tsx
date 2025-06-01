import React, { useEffect, useState } from "react";

import type { CustomStatusPanelProps } from "ag-grid-react";

export function RowCountStatusBarComponent(props: CustomStatusPanelProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const onRowCountChanged = () => {
      setTimeout(() => setCount(props.api.getDisplayedRowCount()), 100);
    };
    props.api.addEventListener("paginationChanged", onRowCountChanged);

    return () => {
      props.api.removeEventListener("paginationChanged", onRowCountChanged);
    };
  }, [props.api]);

  return (
    <div className="ag-status-name-value">
      <span className="component font-bold">Total&nbsp;</span>
      <span className="ag-status-name-value-value">{count}</span>
    </div>
  );
}
