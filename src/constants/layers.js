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

  const geojson = {
    type: "FeatureCollection",
    features: data.map((f) => ({
      type: "Feature",
      geometry: f.geom,
      properties: {
        id: f.id,
        name: f.name,
        type: f.type,
        ...f.properties,
      },
    })),
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
