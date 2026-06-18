import React from "react";
import { ConfigProvider } from "antd";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5", // Modern Deep Indigo primary color
          borderRadius: 10,       // Softer corners for modern UI elements
          fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <Dashboard />
    </ConfigProvider>
  );
}

export default App;