import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterApp from "./router/RouterApp.tsx";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterApp />
    <Toaster richColors />
  </StrictMode>
);
