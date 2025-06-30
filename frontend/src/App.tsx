import Dashboard from "./pages/dashboard/Dashboard"
import { DashboardProvider } from "./context/DashboardContext"

export default function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
