import { useRef, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import MapContext from "../../../hooks/MapContext";

const ZoomControl = () => {
  const { map } = useContext(MapContext);
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (map) {
      map.on("click", (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        //   if (feature) {
        //     const props = feature.get("properties");
        //     const geom = feature.get("geometry");
        //     onFeatureClick({
        //       type: "Feature",
        //       id: props.id,
        //       properties: props,
        //       geometry: geom,
        //     });
        //   } else {
        //     onFeatureClick(null);
        //   }
      });
      
      mapInstanceRef.current = map;
      
        return () => {
          map.setTarget(undefined);
          mapInstanceRef.current = null;
        };
    }
  }, [map]);
  return (
    <>
      {/* Map Controls */}
      <div className="map-controls-top-right">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            mapInstanceRef.current?.getView().animate({
              zoom: (mapInstanceRef.current?.getView().getZoom() || 13) + 1,
              duration: 200,
            });
          }}
          className="glass-card w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
        >
          +
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            mapInstanceRef.current?.getView().animate({
              zoom: (mapInstanceRef.current?.getView().getZoom() || 13) - 1,
              duration: 200,
            });
          }}
          className="glass-card w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
        >
          −
        </motion.button>
      </div>
    </>
  );
};

export default ZoomControl;
