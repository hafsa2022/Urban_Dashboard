import { useEffect, useState } from "react";
import { Users, GraduationCap, Building2, TreePine } from "lucide-react";
import { supabase } from "../../utils/supabase";

export default function KpiCards({ filters }) {
  const [counts, setCounts] = useState({
    schools: 0,
    hospitals: 0,
    parks: 0,
    population: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { region = null, regionGeom = null } = filters;

        // Get facility counts from facilities_geojson view
        // If a region is selected, filter by that region; otherwise get all
        const getCount = async (facilityType) => {
          try {
            let query = supabase
              .from("facilities_geojson")
              .select("id", { count: "exact", head: true })
              .eq("type", facilityType);

            // If region is selected, filter by region name
            if (region) {
              // query = query.eq("region", region);
              query = query.filter("properties->>region", "eq", region);
            }

            const { count, error } = await query;
            if (error) {
              console.warn(`Count failed for ${facilityType}:`, error);
              return 0;
            }
            return count || 0;
          } catch (e) {
            console.warn(`Count error for ${facilityType}:`, e);
            return 0;
          }
        };

        const [sCount, hCount, pCount] = await Promise.all([
          getCount("school"),
          getCount("hospital"),
          getCount("park"),
        ]);

        // Fetch population from regions
        let population = 0;
        if (region) {
          const { data } = await supabase
            .from("regions")
            .select("population")
            .eq("nom_region", region)
            .single();
          population = data?.population || 0;
        } else {
          const { data: regions } = await supabase
            .from("regions")
            .select("population");
          if (regions && Array.isArray(regions)) {
            population = regions.reduce((acc, r) => acc + (r.population || 0), 0);
          }
        }

        setCounts({
          schools: sCount,
          hospitals: hCount,
          parks: pCount,
          population,
        });
      } catch (error) {
        console.error("Error loading KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  const kpiData = [
    {
      label: "Population",
      value: counts.population.toLocaleString(),
      icon: Users,
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Schools",
      value: counts.schools,
      icon: GraduationCap,
      color: "from-red-500 to-red-600",
      lightColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      label: "Hospitals",
      value: counts.hospitals,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Parks",
      value: counts.parks,
      icon: TreePine,
      color: "from-green-500 to-green-600",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpiData.map(
        ({
          label,
          value,
          icon: Icon,
          color,
          lightColor,
          textColor,
        }) => (
          <div
            key={label}
            className={`${lightColor} border-l-4 border-gradient-to-b rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {label}
                </p>
                <p className={`text-3xl font-bold ${textColor}`}>
                  {loading ? "..." : value}
                </p>
              </div>
              <div
                className={`bg-linear-to-br ${color} p-3 rounded-lg text-white shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
