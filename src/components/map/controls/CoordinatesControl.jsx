import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import MapContext from "../../../hooks/MapContext";
import { toLonLat } from "ol/proj";

const CoordinatesControl = () => {
  const [coordinates, setCoordinates] = useState(null);
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    // Track mouse position
    map.on("pointermove", (evt) => {
      const coord = toLonLat(evt.coordinate);
      setCoordinates([coord[0], coord[1]]);

      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
  }, [map]);
  return (
    <>
      {coordinates && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="map-controls-bottom-left"
        >
          <div className="glass-card px-3 py-2">
            <span className="coord-display">
              {coordinates[1].toFixed(6)}°N, {coordinates[0].toFixed(6)}°W
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CoordinatesControl;
