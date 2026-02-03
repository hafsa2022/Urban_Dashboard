// RotateNorthControl.js
import React, { useContext, useEffect, useRef } from "react";
import Control from "ol/control/Control";
import MapContext from "../../../hooks/MapContext";
import { motion } from "framer-motion";

const RotateNorthControl = () => {
  const { map } = useContext(MapContext);
  const mapInstanceRef = useRef(null);
  //   const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, [map]);

  return (
    <>
      <motion.div className="map-controls-bottom-right">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-card w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          onClick={() => {
            mapInstanceRef.current?.getView().animate({
              rotation:
                (mapInstanceRef.current?.getView().setRotation(0)),
              duration: 200,
            });
          }}
        >
          N
        </motion.button>
      </motion.div>
    </>
  );
};

export default RotateNorthControl;
