import React, { useContext, useEffect, useState, useRef } from "react";
import MapContext from "../../hooks/MapContext";
import FeaturePopup from "./FeaturePopup";
import FeatureDetailsDialog from "./FeatureDetailsDialog";

export default function MapInteraction() {
  const { map } = useContext(MapContext);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event) => {
      let foundFeature = null;

      // Check all layers for features at the clicked point
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (!foundFeature) {
          foundFeature = feature;
        }
      });

      if (foundFeature) {
        setSelectedFeature(foundFeature);
        setPopupPosition(event.coordinate);
        setShowDetails(false);
      } else {
        setSelectedFeature(null);
        setPopupPosition(null);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.un("click", handleMapClick);
    };
  }, [map]);

  // Convert map coordinates to screen pixel position for popup
  const getPixelPosition = () => {
    if (!popupPosition || !map) return null;
    const pixel = map.getPixelFromCoordinate(popupPosition);
    return {
      left: `${pixel[0] + 10}px`,
      top: `${pixel[1] - 10}px`,
    };
  };

  const pixelPosition = getPixelPosition();

  return (
    <>
      {selectedFeature && pixelPosition && !showDetails && (
        <div ref={popupRef} style={pixelPosition} className="absolute">
          <FeaturePopup
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
            onViewDetails={() => setShowDetails(true)}
          />
        </div>
      )}

      {showDetails && selectedFeature && (
        <FeatureDetailsDialog
          feature={selectedFeature}
          onClose={() => {
            setShowDetails(false);
            setSelectedFeature(null);
          }}
        />
      )}
    </>
  );
}
