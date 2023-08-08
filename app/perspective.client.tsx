import perspective, { type Table, type TableData } from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import { type HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";
import { useEffect, useId, useRef } from "react";

import "~/styles/perspective.css";

export function PerspectiveViewer({ data }: { data: TableData }) {
  const id = useId();
  const ref = useRef<null | Table>(null);

  useEffect(() => {
    if (ref.current === null) {
      init();
    } else {
      ref.current.update(data);
    }

    async function init() {
      const el = document.querySelector(
        "perspective-viewer",
      ) as HTMLPerspectiveViewerElement;

      const worker = perspective.worker();

      // Create a table in this worker
      const table = await worker.table(data);

      el.load(table);
      el.restore({settings: true, plugin_config: {editable: true}})
      ref.current = table;
    }
  }, [data]);

  return (
    <perspective-viewer
      id={id}
    />
  );
}
