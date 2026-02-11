import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon } from "ol/style";
import { supabase } from "../utils/supabase";

export const loadFacilitiesLayer = async (type, icon) => {
  const { data, error } = await supabase
    .from("facilities_geojson") // 👈 VIEW
    .select("*")
    .eq("type", type);

  if (error || !data) {
    console.error("Supabase error:", error);
    return null;
  }

  // Ensure proper GeoJSON format
  const geojson = {
    type: "FeatureCollection",
    features: data.map((f) => {
      // Handle geom - it could be a GeoJSON object or a string
      let geometry = null;
      try {
        if (typeof f.geom === 'string') {
          geometry = JSON.parse(f.geom);
        } else {
          geometry = f.geom;
        }
      } catch (e) {
        console.error(`Failed to parse geometry for facility ${f.id}:`, e);
        return null;
      }

      return {
        type: "Feature",
        geometry: geometry,
        properties: {
          id: f.id,
          name: f.name,
          type: f.type,
          region_id: f.region_id,
          ...f.properties,
        },
      };
    }).filter(Boolean), // Remove any null features
  };

  const layer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    }),
    visible: true,
    style: new Style({
      image: new Icon({
        src: icon || "/marker.png",
        scale: 0.08,
      }),
    }),
  });

  layer.set("title", type);

  return layer;
};
