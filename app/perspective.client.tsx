import perspective, { type Table, type TableData } from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import { type HTMLPerspectiveViewerElement, type PerspectiveViewerConfig } from "@finos/perspective-viewer";
import { useEffect, useId, useRef } from "react";

import "~/styles/perspective.css";

export function PerspectiveViewer({ data }: { data: TableData }) {
  const id = useId();
  const ref = useRef<null | Table>(null);
  const config: PerspectiveViewerConfig = {
    plugin: "Datagrid",
    settings: true,
    plugin_config: {
      editable: true
    }
  }

  let initializing: "no" | "pending" | "done" = "no";

  useEffect(() => {
    if (initializing === "no") {
      initializing = "pending";
      init();
    } else {
      ref.current?.update(data);
    }

    async function init() {
      const el = document.querySelector(
        `#${CSS.escape(id)}`
      ) as HTMLDivElement;

      await customElements.whenDefined("perspective-viewer");
      await customElements.whenDefined("perspective-viewer-datagrid");
      await customElements.whenDefined("perspective-viewer-datagrid-toolbar");

      const worker = perspective.worker();

      // Create a table in this worker
      const table = await worker.table(data);
      const viewer = document.createElement("perspective-viewer");
      el.appendChild(viewer);
      viewer.load(table);
      viewer.restore(config)
      initializing = "done";
    }
  }, [data]);

  return (
    <div
      id={id}
    />
  );
}
