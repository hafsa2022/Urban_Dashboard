import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MapComponent from "../components/map/Map";
import MapContentLoader from "../components/map/MapContentLoader";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import KpiCards from "../components/dashboard/KpiCards";
import FilterSidebar from "../components/dashboard/FilterSidebar";
import StatsCharts from "../components/dashboard/StatsCharts";
import useFacilities from "../components/dashboard/useFacilities";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [filters, setFilters] = useState({});
  const { facilities, loading: facilitiesLoading } = useFacilities();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* NavBar - full width */}
      <NavBar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left column: Filters + Stats Charts - Fixed width on desktop, hidden on mobile */}
        <div className="hidden lg:flex lg:w-80 flex-col overflow-y-auto border-r border-border bg-card">
          <div className="p-4 space-y-2">
            <FilterSidebar onApply={(f) => setFilters(f)} />
            {!facilitiesLoading && (
              // <div className="border-t border-border pt-4">
                <StatsCharts facilities={facilities} region={filters.region} equipment={filters.equipment} />
              // </div>
            )}
          </div>
        </div>

        {/* Right column: KPI Cards + Map - Full width on mobile */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 overflow-y-auto">
            <KpiCards filters={filters} />
          </div>
          <div className="flex-1 overflow-hidden px-3 sm:px-4 pb-3 sm:pb-4">
            <MapComponent center={[-7.0926, 31.7917]} zoom={5}>
              <MapContentLoader filters={filters} />
            </MapComponent>
          </div>
        </div>
      </div>

      {/* Mobile: Show Stats at bottom on small screens */}
      <div className="lg:hidden border-t border-border bg-card p-4 max-h-64 overflow-y-auto">
        {!facilitiesLoading && (
          <StatsCharts facilities={facilities} region={filters.region} equipment={filters.equipment} />
        )}
      </div>
    </div>
  );
}
export default Dashboard;
