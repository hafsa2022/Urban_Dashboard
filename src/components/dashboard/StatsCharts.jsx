import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export default function StatsCharts({ facilities, region, equipment }) {
  const [counts, setCounts] = useState({ school: 0, hospital: 0, hotel: 0, park: 0 });

  useEffect(() => {
    // Filtre par région si précisé
    let filtered = region
      ? facilities.filter((f) => {
          const facilityRegionId = Number(f.region_id);
          const filterRegionId = Number(region);
          return facilityRegionId === filterRegionId;
        })
      : facilities;

    // Filtre par equipment si précisé
    if (equipment) {
      const shouldShowSchools = equipment.school !== false;
      const shouldShowHospitals = equipment.hospital !== false;
      const shouldShowHotels = equipment.hotel !== false;
      const shouldShowParks = equipment.park !== false;

      filtered = filtered.filter((f) => {
        if (f.type === "school") return shouldShowSchools;
        if (f.type === "hospital") return shouldShowHospitals;
        if (f.type === "hotel") return shouldShowHotels;
        if (f.type === "park") return shouldShowParks;
        return false;
      });
    }

    setCounts({
      school: filtered.filter((f) => f.type === "school").length,
      hospital: filtered.filter((f) => f.type === "hospital").length,
      hotel: filtered.filter((f) => f.type === "hotel").length,
      park: filtered.filter((f) => f.type === "park").length,
    });
  }, [facilities, region, equipment]);

  const total = counts.school + counts.hospital + counts.hotel + counts.park;

  // Si aucune donnée à afficher
  if (total === 0) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="text-sm sm:text-base font-semibold text-foreground">
          Facilities Statistics
        </h4>
        <div className="p-4 bg-muted rounded border border-border text-muted-foreground text-xs sm:text-sm">
          No facilities data {region ? "for this region" : "available"}
        </div>
      </div>
    );
  }

  const pieData = {
    labels: ["Schools", "Hospitals", "Hotels", "Parks"],
    datasets: [
      {
        data: [counts.school, counts.hospital, counts.hotel, counts.park],
        backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="w-full bg-card border-none rounded-lg p-4 space-y-4 bg-linear-to-br from-slate-50 to-slate-100 ">
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-foreground">
          Facilities Statistics
          {/* {region && (
            <span className="text-xs text-muted-foreground font-normal ml-2">
              (Region: {region})
            </span>
          )} */}
        </h4>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-4 border-b border-border">
        <div className="bg-red-50 dark:bg-red-950/20 p-2 sm:p-3 rounded border border-red-200 dark:border-red-900/30">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{counts.school}</div>
          <div className="text-xs text-red-700 dark:text-red-400">Schools</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-2 sm:p-3 rounded border border-blue-200 dark:border-blue-900/30">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{counts.hospital}</div>
          <div className="text-xs text-blue-700 dark:text-blue-400">Hospitals</div>
        </div>
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{counts.hospital}</div>
          <div className="text-xs text-blue-700">Hospitals</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-2 sm:p-3 rounded border border-green-200 dark:border-green-900/30">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{counts.park}</div>
          <div className="text-xs text-green-700 dark:text-green-400">Parks</div>
        </div>
      </div> */}

      {/* Chart */}
      <div className="w-full h-48 sm:h-64 flex items-center justify-center">
        <div className="w-full max-w-xs">
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
