import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import WKT from "ol/format/WKT";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke, Text } from "ol/style";
import { supabase } from "../utils/supabase";
import { getRegionColor } from "./regionsCode";


export const loadRegionsLayer = async () => {
  const { data, error } = await supabase.from("regions").select(`
      geom,
      code_region,
      nom_region,
      nom_arabe,
      marocains,
      etrangers,
      population,
      menages
    `);

  if (error) {
    console.error("Regions error:", error);
    return null;
  }

  const format = new WKT();
  const geojsonFormat = new GeoJSON();

  const features = data
    .map((row) => {
      if (!row.geom) return null;

      let feature = null;
      const geomValue = row.geom;
      try {
        if (typeof geomValue === "string") {
          if (geomValue.trim() === "") return null;
          feature = format.readFeature(geomValue, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
        } else if (typeof geomValue === "object") {
          feature = geojsonFormat.readFeature(geomValue, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
        } else {
          return null;
        }
      } catch (err) {
        console.warn("Failed to parse geometry for region row:", row, err);
        return null;
      }

      if (!feature) return null;

      feature.setProperties({
        code_region: row.code_region,
        nom_region: row.nom_region,
        nom_arabe: row.nom_arabe,
        marocains: row.marocains,
        etrangers: row.etrangers,
        population: row.population,
        menages: row.menages,
      });

      return feature;
    })
    .filter(Boolean);

  const layer = new VectorLayer({
    source: new VectorSource({ features }),
    visible: true,
    style: (feature) =>
      new Style({
        fill: new Fill({
          color: getRegionColor(feature.get("code_region")),
        }),
        stroke: new Stroke({
          color: "#1e3799",
          width: 1.5,
        }),
        text: new Text({
          text: feature.get("nom_region"),
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 3 }),
        }),
      }),
  });
  layer.setVisible(true);
  layer.set("key", "region");
  layer.set("title", "Régions du Maroc");

  return layer;
};
