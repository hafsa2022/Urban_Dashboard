import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

// Récupère toutes les facilities avec leur region_id et type
export default function useFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      setLoading(true);
      try {
        // Charger depuis la table unifiée 'facilities'
        const { data, error } = await supabase
          .from("facilities")
          .select("id,type,region_id");
        
        if (error) {
          console.error("Error fetching facilities:", error);
          setFacilities([]);
        } else {
          setFacilities(data || []);
        }
      } catch (err) {
        console.error("Error fetching facilities:", err);
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFacilities();
  }, []);

  return { facilities, loading };
}
