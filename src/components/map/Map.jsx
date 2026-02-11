import React, { useRef, useEffect, useState } from "react";
import MapContext from "../../hooks/MapContext";
import { motion } from "framer-motion";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";

const MapComponent = ({ children, zoom, center }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapObj = new Map({
      target: mapRef.current, // Target the div with the ref
      view: new View({
        center: fromLonLat(center), // Center on the prime meridian and equator
        zoom: zoom, // Initial zoom level
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: [],
    });

    setMap(mapObj);
    //     // Clean up when the component unmounts
    return () => mapObj.setTarget(undefined);
  }, [center, zoom]);


  return (
    <motion.div
      ref={mapRef}
      className="relative w-full h-full"
      style={{ width: "100%", height: "100%" }}
    >
      <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
    </motion.div>
  );
};

export default MapComponent;
