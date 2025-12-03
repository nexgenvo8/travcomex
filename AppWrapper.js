import React from "react";
import App from "./App";
import { ThemeProvider } from "./src/theme/ThemeContext";

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
