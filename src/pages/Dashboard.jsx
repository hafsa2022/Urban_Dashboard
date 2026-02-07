import MapComponent from "../components/map/Map";
import RotateNorthControl from "../components/map/controls/RotateNorthControl";
import CoordinatesControl from "../components/map/controls/CoordinatesControl";
import ZoomControl from "../components/map/controls/ZoomControl";
import LayerSwitcherControl from "../components/map/controls/LayerSwitcherControl";
import SearchBar from "../components/dashboard/SearchBar";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import NavBar from "../components/NavBar";
import { useEffect, useState, useContext } from "react";
import { loadFacilitiesLayer } from "../constants/layers";
import MapContext from "../hooks/MapContext";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const map = useContext(MapContext);
  const [layers, setLayers] = useState({});

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

      setLayers((prevLayers) => ({
        ...prevLayers,
        school: schools,
        hospital: hospitals,
        park: parks,
      }));
    });
  }, [map]);

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
        <SearchBar />
        <RotateNorthControl />
        <CoordinatesControl />
        <ZoomControl />
        <LayerSwitcherControl layers={layers} />
      </MapComponent>
    </div>
  );
}
export default Dashboard;
