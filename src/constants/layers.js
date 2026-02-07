// // components/map/Layers.js
// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import XYZ from "ol/source/XYZ";

// const osmLayer = new TileLayer({
//   title: "Roads",
//   visible: true,
//   source: new OSM(),
// });

// const satelliteLayer = new TileLayer({
//   title: "Satellite",
//   visible: false,
//   source: new XYZ({
//     url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
//   }),
// });

// export{
//     osmLayer, 
//     satelliteLayer
// }

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
        featureProjection: "EPSG:4326",
      }),
    }),
    visible: true,
    style: new Style({
      image: new Icon({
        src: icon || "/marker.png",
        scale: 0.06,
      }),
    }),
  });

  layer.set("title", type); // ⭐ IMPORTANT POUR SWITCHER

  return layer;
};
