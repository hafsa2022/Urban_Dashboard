import { useEffect, useState } from "react";
import {
  GraduationCap,
  Building2,
  TreePine,
  MapPin,
  Filter,
  Hotel,
} from "lucide-react";
import { supabase } from "../../utils/supabase";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function FilterSidebar({ onApply }) {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [equipment, setEquipment] = useState({
    school: true,
    hospital: true,
    park: true,
    hotel: true,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("regions")
        .select("ogc_fid,nom_region,code_region");
      setRegions(data || []);
    };
    load();
  }, []);

  const toggleEquip = (key) => {
    setEquipment((s) => ({ ...s, [key]: !s[key] }));
  };

  const applyFilters = async () => {
    let regionGeom = null;
    let regionId = null;

    if (selectedRegion) {
      // Fetch geometry and region_id when region is selected
      const { data } = await supabase
        .from("regions")
        .select("ogc_fid, geom")
        .eq("nom_region", selectedRegion)
        .single();
      regionGeom = data?.geom || null;
      regionId = data?.ogc_fid || null;
    }


    onApply({
      region: regionId || null,
      regionName: selectedRegion || null,
      regionGeom: regionGeom,
      equipment,
    });
  };

  // Reset all filters to initial state
  const resetFilters = () => {
    setSelectedRegion("");
    setEquipment({ school: true, hospital: true, park: true, hotel: true });
    onApply({
      region: null,
      regionName: null,
      regionGeom: null,
      equipment: { school: true, hospital: true, park: true, hotel: true },
    });
  };

  // Détection d'un filtre actif
  const hasActiveFilter =
    selectedRegion ||
    !equipment.school ||
    !equipment.hospital ||
    !equipment.park ||
    !equipment.hotel;
  return (
    <aside className="w-full bg-card border-0 p-4 sm:p-6 space-y-4 bg-linear-to-br from-slate-50 to-slate-100 ">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Administrative Zone Filter */}
        <div>
          <label className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 block">Region</label>
          <select
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.ogc_fid} value={r.nom_region}>
                {r.nom_region}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment Type Filter */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Facilities
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition">
              <Checkbox
                checked={equipment.school}
                onCheckedChange={() => toggleEquip("school")}
              />
              <GraduationCap className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Schools</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition">
              <Checkbox
                checked={equipment.hospital}
                onCheckedChange={() => toggleEquip("hospital")}
              />
              <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Hospitals</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition">
              <Checkbox
                checked={equipment.hotel}
                onCheckedChange={() => toggleEquip("hotel")}
              />
              <Hotel className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Hotels</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition">
              <Checkbox
                checked={equipment.park}
                onCheckedChange={() => toggleEquip("park")}
              />
              <TreePine className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Parks</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          {hasActiveFilter && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex-1"
              onClick={resetFilters}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={applyFilters}
            className="flex-1 text-xs sm:text-sm font-semibold"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </aside>
  );
}
