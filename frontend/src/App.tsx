import { BrowserRouter } from "react-router-dom";
import { ApiProvider } from "@/api/provider";
import { AppShell } from "@/components/layout/app-shell";
import { AppRoutes } from "@/router";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
