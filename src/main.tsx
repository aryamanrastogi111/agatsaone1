import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useTrackingPixels } from "./hooks/useTrackingPixels";

function Root() {
  useTrackingPixels();
  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
