import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MapContext from "../hooks/MapContext";
import MapComponent from "../components/map/Map";
import MapInteraction from "../components/map/MapInteraction";
import RotateNorthControl from "../components/map/controls/RotateNorthControl";
import CoordinatesControl from "../components/map/controls/CoordinatesControl";
import ZoomControl from "../components/map/controls/ZoomControl";
import LayerSwitcherControl from "../components/map/controls/LayerSwitcherControl";
import SearchBar from "../components/dashboard/SearchBar";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import { loadFacilitiesLayer } from "../constants/layers";
import { Style, Icon } from "ol/style";


function MapContentLoader() {
  const { map } = useContext(MapContext);
  const [layers, setLayers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [layerStyles, setLayerStyles] = useState({});
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    if (!map) return;
   
    Promise.all([
      loadFacilitiesLayer("school", "icons/school-marker.png"),
      loadFacilitiesLayer("hospital", "icons/hospital-marker.png"),
      loadFacilitiesLayer("park", "icons/park-marker.png"),
    ]).then(([schools, hospitals, parks]) => {
      console.log("Layers loaded:", { schools, hospitals, parks });
      map.addLayer(schools);
      map.addLayer(hospitals);
      map.addLayer(parks);

      // Store original styles for each layer type
      const styles = {};
      if (schools) {
        styles.school = schools.getStyle();
      }
      if (hospitals) {
        styles.hospital = hospitals.getStyle();
      }
      if (parks) {
        styles.park = parks.getStyle();
      }
      setLayerStyles(styles);

      setLayers((prevLayers) => ({
        ...prevLayers,
        school: schools,
        hospital: hospitals,
        park: parks,
      }));
    });
  }, [map]);

  // Handle search filtering
  useEffect(() => {
    if (!map || Object.keys(layers).length === 0) return;

    if (searchQuery.trim() === "") {
      setResultCount(0);
      // Show all features - set style function to return original style
      Object.entries(layers).forEach(([type, layer]) => {
        if (layer) {
          layer.setStyle((feature) => {
            return new Style({
              image: new Icon({
                src: `/icons/${type}-marker.png`,
                scale: 0.08,
              }),
            });
          });
        }
      });
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      let matchCount = 0;

      // Filter features and apply styles conditionally
      Object.entries(layers).forEach(([type, layer]) => {
        if (layer) {
          layer.setStyle((feature) => {
            // Try to get name from multiple possible locations
            const properties = feature.getProperties();
            const featureName = (
              properties?.name || 
              properties?.title || 
              properties?.Name ||
              ""
            )?.toString().toLowerCase().trim() || "";

            console.log("Feature name:", featureName, "Query:", lowerQuery, "Match:", featureName.includes(lowerQuery));

            if (featureName.includes(lowerQuery)) {
              matchCount++;
              // Show matching features
              return new Style({
                image: new Icon({
                  src: `/icons/${type}-marker.png`,
                  scale: 0.08,
                }),
              });
            } else {
              // Hide non-matching features by returning null style
              return null;
            }
          });
        }
      });
      
      setResultCount(matchCount);
    }
  }, [searchQuery, layers, map]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} resultCount={resultCount} />
      <MapInteraction />
      <RotateNorthControl />
      <CoordinatesControl />
      <ZoomControl />
      <LayerSwitcherControl layers={layers} />
    </>
  );
}

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <NavBar />
      <MapComponent center={[-7.0926, 31.7917]} zoom={6}>
        <MapContentLoader />
      </MapComponent>
    </div>
  );
}
export default Dashboard;
