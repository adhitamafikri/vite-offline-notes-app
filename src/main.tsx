import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router'
import { router } from '@/router'
import "./index.css";
// import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <RouterProvider>
      <App />
    </RouterProvider> */}

    <RouterProvider router={router} />

    {/* <App /> */}
  </StrictMode>
);
