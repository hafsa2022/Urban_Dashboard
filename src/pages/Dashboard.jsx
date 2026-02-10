import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MapComponent from "../components/map/Map";
import MapContentLoader from "../components/map/MapContentLoader";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import KpiCards from "../components/dashboard/KpiCards";
import FilterSidebar from "../components/dashboard/FilterSidebar";

// function MapContentLoader({ filters }) {
//   const { map } = useContext(MapContext);
//   const [layers, setLayers] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [layerStyles, setLayerStyles] = useState({});

//   useEffect(() => {
//     if (!map) return;

//     Promise.all([
//       loadFacilitiesLayer("school", "icons/school-marker.png"),
//       loadFacilitiesLayer("hospital", "icons/hospital-marker.png"),
//       loadFacilitiesLayer("park", "icons/park-marker.png"),
//       loadRegionsLayer(),
//     ]).then(([schools, hospitals, parks, regionsLayer]) => {
//       // console.log("Layers loaded:", { schools, hospitals, parks });
//       map.addLayer(regionsLayer);
//       map.addLayer(schools);
//       map.addLayer(hospitals);
//       map.addLayer(parks);

//       // Store original styles for each layer type
//       const styles = {};
//       if (schools) {
//         styles.school = schools.getStyle();
//       }
//       if (hospitals) {
//         styles.hospital = hospitals.getStyle();
//       }
//       if (parks) {
//         styles.park = parks.getStyle();
//       }
//       if (regionsLayer) {
//         styles.regions = regionsLayer.getStyle();
//       } else {
//         console.warn("Regions layer not loaded, cannot store original style.");
//       }
//       setLayerStyles(styles);

//       setLayers((prevLayers) => ({
//         ...prevLayers,
//         school: schools,
//         hospital: hospitals,
//         park: parks,
//         regions: regionsLayer,
//       }));
//     });
//   }, [map]);

//   // Handle search filtering
//   useEffect(() => {
//     if (!map || Object.keys(layers).length === 0) return;

//     if (searchQuery.trim() === "") {
//       // Show all features - set style function to return original style
//       Object.entries(layers).forEach(([type, layer]) => {
//         if (layer) {
//           // Restore original style for this layer if we saved it
//           const originalStyle = layerStyles[type];
//           if (originalStyle) {
//             // If originalStyle is a function (style function), set it directly
//             layer.setStyle(
//               typeof originalStyle === "function"
//                 ? originalStyle
//                 : () => originalStyle,
//             );
//           } else {
//             // Fallback for point layers: use marker icon
//             layer.setStyle((feature) => {
//               return new Style({
//                 image: new Icon({
//                   src: `/icons/${type}-marker.png`,
//                   scale: 0.08,
//                 }),
//               });
//             });
//           }
//         }
//       });
//     } else {
//       const lowerQuery = searchQuery.toLowerCase();

//       // Filter features and apply styles conditionally
//       Object.entries(layers).forEach(([type, layer]) => {
//         if (layer) {
//           layer.setStyle((feature) => {
//             // Try to get name from multiple possible locations
//             const properties = feature.getProperties();
//             const featureName =
//               (properties?.name || properties?.title || properties?.Name || "")
//                 ?.toString()
//                 .toLowerCase()
//                 .trim() || "";

//             console.log(
//               "Feature name:",
//               featureName,
//               "Query:",
//               lowerQuery,
//               "Match:",
//               featureName.includes(lowerQuery),
//             );

//             if (featureName.includes(lowerQuery)) {
//               // For region polygons, return the original region style (fill/stroke/text)
//               if (type === "regions") {
//                 const original = layerStyles.regions;
//                 if (original) {
//                   return typeof original === "function"
//                     ? original(feature)
//                     : original;
//                 }
//                 // fallback polygon style
//                 return new Style({
//                   fill: new Fill({ color: "rgba(0, 123, 255, 0.35)" }),
//                   stroke: new Stroke({ color: "#1e3799", width: 1.5 }),
//                   text: new Text({
//                     text: feature.get("nom_region"),
//                     fill: new Fill({ color: "#000" }),
//                     stroke: new Stroke({ color: "#fff", width: 3 }),
//                   }),
//                 });
//               }

//               // Show matching point features using their marker icon
//               return new Style({
//                 image: new Icon({
//                   src: `/icons/${type}-marker.png`,
//                   scale: 0.08,
//                 }),
//               });
//             }

//             // Hide non-matching features by returning null style
//             return null;
//           });
//         }
//       });
//     }
//   }, [searchQuery, layers, map, layerStyles]);

//   // Handle filter changes
//   useEffect(() => {
//     if (!map || Object.keys(layers).length === 0) return;

//     const { equipment = {}, region = null, regionGeom = null } = filters;
//     const shouldShowSchools = equipment.school !== false;
//     const shouldShowHospitals = equipment.hospital !== false;
//     const shouldShowParks = equipment.park !== false;

//     if (layers.school) layers.school.setVisible(shouldShowSchools);
//     if (layers.hospital) layers.hospital.setVisible(shouldShowHospitals);
//     if (layers.park) layers.park.setVisible(shouldShowParks);

//     // Highlight selected region
//     if (layers.regions) {
//       layers.regions.setStyle((feature) => {
//         const regionName = feature.get("nom_region");
//         const isSelected = regionName === region;
        
//         if (isSelected) {
//           return new Style({
//             fill: new Fill({ color: "rgba(59, 130, 246, 0.5)" }),
//             stroke: new Stroke({ color: "#1e40af", width: 3 }),
//             text: new Text({
//               text: regionName,
//               fill: new Fill({ color: "#000" }),
//               stroke: new Stroke({ color: "#fff", width: 3 }),
//             }),
//           });
//         }
        
//         return new Style({
//           fill: new Fill({ color: "rgba(0, 123, 255, 0.35)" }),
//           stroke: new Stroke({ color: "#1e3799", width: 1.5 }),
//           text: new Text({
//             text: regionName,
//             fill: new Fill({ color: "#000" }),
//             stroke: new Stroke({ color: "#fff", width: 3 }),
//           }),
//         });
//       });
//     }

//     // Zoom to region extent
//     if (region && regionGeom) {
//       try {
//         const format = new WKT();
//         const feature = format.readFeature(regionGeom, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857",
//         });
//         const extent = feature.getGeometry().getExtent();
//         map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
//       } catch (err) {
//         console.warn("Could not zoom to region:", err);
//       }
//     }
//   }, [filters, layers, map]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   return (
//     <>
//       <SearchBar onSearch={handleSearch} />
//       <MapInteraction />
//       <RotateNorthControl />
//       <CoordinatesControl />
//       <ZoomControl />
//       <LayerSwitcherControl layers={layers} />
//     </>
//   );
// }

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [filters, setFilters] = useState({});

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

      <div className="p-4">
        <KpiCards filters={filters} />
      </div>

      <div className="flex">
        <div className="p-4">
          <FilterSidebar onApply={(f) => setFilters(f)} />
        </div>

        <div className="flex-1">
          <MapComponent center={[-7.0926, 31.7917]} zoom={6}>
            <MapContentLoader filters={filters} />
          </MapComponent>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
