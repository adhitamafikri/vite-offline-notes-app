import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "@/router";
import { PouchDBProvider } from "@/contexts/pouch-db.context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PouchDBProvider>
      <RouterProvider router={router} />
    </PouchDBProvider>
  </StrictMode>
);
