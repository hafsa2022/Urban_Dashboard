import { useEffect, useState } from "react";
import { GraduationCap, Building2, TreePine, MapPin, Filter } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function FilterSidebar({ onApply }) {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [equipment, setEquipment] = useState({ school: true, hospital: true, park: true });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("regions").select("ogc_fid,nom_region,code_region");
      setRegions(data || []);
    };
    load();
  }, []);

  const toggleEquip = (key) => {
    setEquipment((s) => ({ ...s, [key]: !s[key] }));
  };

  const applyFilters = async () => {
    let regionGeom = null;
    
    if (selectedRegion) {
      // Fetch geometry only when region is selected
      const { data } = await supabase
        .from("regions")
        .select("geom")
        .eq("nom_region", selectedRegion)
        .single();
      regionGeom = data?.geom || null;
    }

    onApply({ 
      region: selectedRegion || null, 
      regionGeom: regionGeom,
      equipment 
    });
  };

  return (
    <aside className="w-72 bg-linear-to-br from-slate-50 to-slate-100 shadow-lg rounded-lg p-6 border border-slate-200 sticky top-20 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-slate-800">Select Region</h3>
      </div>

      <div className="space-y-6">
        {/* Administrative Zone Filter */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Region</h4>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r.ogc_fid} value={r.nom_region}>{r.nom_region}</option>
            ))}
          </select>
        </div>

        {/* Equipment Type Filter */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />Equipment Type
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-white/50 cursor-pointer transition">
              <Checkbox checked={equipment.school} onCheckedChange={() => toggleEquip('school')} />
              <GraduationCap className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-slate-700">Schools</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-white/50 cursor-pointer transition">
              <Checkbox checked={equipment.hospital} onCheckedChange={() => toggleEquip('hospital')} />
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700">Hospitals</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded-md hover:bg-white/50 cursor-pointer transition">
              <Checkbox checked={equipment.park} onCheckedChange={() => toggleEquip('park')} />
              <TreePine className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700">Parks</span>
            </label>
          </div>
        </div>

        {/* Active Filters Badge */}
        {(selectedRegion || !equipment.school || !equipment.hospital || !equipment.park) && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-md">
            <p className="text-xs font-medium text-primary">
              {selectedRegion && `Zone: ${selectedRegion}`}
              {selectedRegion && (!equipment.school || !equipment.hospital || !equipment.park) && " • "}
              {!equipment.school || !equipment.hospital || !equipment.park ? `${Object.values(equipment).filter(Boolean).length}/3 equipment` : ""}
            </p>
          </div>
        )}

        {/* Apply Filter Button */}
        <Button 
          onClick={applyFilters}
          className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold"
        >
          Apply Filter
        </Button>
      </div>
    </aside>
  );
}
