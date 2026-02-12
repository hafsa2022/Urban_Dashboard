import { useEffect, useState, useContext } from "react";
import MapContext from "../../hooks/MapContext";
import MapInteraction from "../../components/map/MapInteraction";
import RotateNorthControl from "../../components/map/controls/RotateNorthControl";
import CoordinatesControl from "../../components/map/controls/CoordinatesControl";
import ZoomControl from "../../components/map/controls/ZoomControl";
import LayerSwitcherControl from "../../components/map/controls/LayerSwitcherControl";
import SearchBar from "../../components/dashboard/SearchBar";
import { loadFacilitiesLayer } from "../../constants/layers";
import { loadRegionsLayer } from "../../constants/loadRegionsLayer";
import { getRegionColor } from "../../constants/regionsCode";
import { Style, Icon, Fill, Stroke, Text } from "ol/style";
import VectorSource from "ol/source/Vector";
import WKT from "ol/format/WKT";
import GeoJSON from "ol/format/GeoJSON";

function MapContentLoader({ filters, facilities = [] }) {
  const { map } = useContext(MapContext);
  const [layers, setLayers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [layerStyles, setLayerStyles] = useState({});

  useEffect(() => {
    if (!map) return;

    Promise.all([
      loadFacilitiesLayer("school", "icons/school-marker.png"),
      loadFacilitiesLayer("hospital", "icons/hospital-marker.png"),
      loadFacilitiesLayer("park", "icons/park-marker.png"),
      loadFacilitiesLayer("hotel", "icons/hotel-marker.png"),
      // loadFacilitiesLayer("sport-center", "icons/sportCenter-marker.png"),
      loadRegionsLayer(),
    ]).then(([schools, hospitals, parks, hotels, regionsLayer]) => {
      // console.log("Layers loaded:", { schools, hospitals, parks });
      map.addLayer(regionsLayer);
      map.addLayer(schools);
      map.addLayer(hospitals);
      map.addLayer(parks);
      map.addLayer(hotels);

      // Store original styles for each layer type
      const styles = {};
      if (schools) {
        styles.school = schools.getStyle();
      }
      if (hospitals) {
        styles.hospital = hospitals.getStyle();
      }
      if (hotels) {
        styles.hotel = hotels.getStyle();
      }
      if (parks) {
        styles.park = parks.getStyle();
      }
      if (regionsLayer) {
        styles.regions = regionsLayer.getStyle();
      } else {
        console.warn("Regions layer not loaded, cannot store original style.");
      }
      setLayerStyles(styles);

      setLayers((prevLayers) => ({
        ...prevLayers,
        school: schools,
        hospital: hospitals,
        hotel: hotels,
        park: parks,
        regions: regionsLayer,
      }));
    });
  }, [map]);

  // Handle search filtering
  useEffect(() => {
    if (!map || Object.keys(layers).length === 0) return;

    if (searchQuery.trim() === "") {
      // Show all features - set style function to return original style
      Object.entries(layers).forEach(([type, layer]) => {
        if (layer) {
          // Restore original style for this layer if we saved it
          const originalStyle = layerStyles[type];
          if (originalStyle) {
            // If originalStyle is a function (style function), set it directly
            layer.setStyle(
              typeof originalStyle === "function"
                ? originalStyle
                : () => originalStyle,
            );
          } else {
            // Fallback for point layers: use marker icon
            layer.setStyle((feature) => {
              return new Style({
                image: new Icon({
                  src: `/icons/${type}-marker.png`,
                  scale: 0.08,
                }),
              });
            });
          }
        }
      });
    } else {
      const lowerQuery = searchQuery.toLowerCase();

      // Filter features and apply styles conditionally
      Object.entries(layers).forEach(([type, layer]) => {
        if (layer) {
          layer.setStyle((feature) => {
            // Try to get name from multiple possible locations
            const properties = feature.getProperties();
            const featureName =
              (properties?.name || properties?.title || properties?.Name || "")
                ?.toString()
                .toLowerCase()
                .trim() || "";

            console.log(
              "Feature name:",
              featureName,
              "Query:",
              lowerQuery,
              "Match:",
              featureName.includes(lowerQuery),
            );

            if (featureName.includes(lowerQuery)) {
              // For region polygons, return the original region style (fill/stroke/text)
              if (type === "regions") {
                const original = layerStyles.regions;
                if (original) {
                  return typeof original === "function"
                    ? original(feature)
                    : original;
                }
                // fallback polygon style
                return new Style({
                  fill: new Fill({ color: "rgba(0, 123, 255, 0.35)" }),
                  stroke: new Stroke({ color: "#1e3799", width: 1.5 }),
                  text: new Text({
                    text: feature.get("nom_region"),
                    fill: new Fill({ color: "#000" }),
                    stroke: new Stroke({ color: "#fff", width: 3 }),
                  }),
                });
              }

              // Show matching point features using their marker icon
              return new Style({
                image: new Icon({
                  src: `/icons/${type}-marker.png`,
                  scale: 0.08,
                }),
              });
            }

            // Hide non-matching features by returning null style
            return null;
          });
        }
      });
    }
  }, [searchQuery, layers, map, layerStyles]);

  // Handle filter changes
  useEffect(() => {
    if (!map || Object.keys(layers).length === 0) return;

    const { equipment = {}, region = null, regionGeom = null } = filters;
    const shouldShowSchools = equipment.school !== false;
    const shouldShowHospitals = equipment.hospital !== false;
    const shouldShowHotels = equipment.hotel !== false;
    const shouldShowParks = equipment.park !== false;

    // Handle equipment visibility
    if (layers.school) layers.school.setVisible(shouldShowSchools);
    if (layers.hospital) layers.hospital.setVisible(shouldShowHospitals);
    if (layers.hotel) layers.hotel.setVisible(shouldShowHotels);
    if (layers.park) layers.park.setVisible(shouldShowParks);

    // If region is selected, filter facilities to only show those in the region
    if (region && regionGeom) {
      try {
        const format = new WKT();
        const regionFeature = format.readFeature(regionGeom, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        const regionGeometry = regionFeature.getGeometry();

        // Only filter visible layers based on equipment settings
        const layersToFilter = [];
        if (shouldShowSchools) layersToFilter.push({ type: "school", layer: layers.school });
        if (shouldShowHospitals) layersToFilter.push({ type: "hospital", layer: layers.hospital });
        if (shouldShowParks) layersToFilter.push({ type: "park", layer: layers.park });
        if (shouldShowHotels) layersToFilter.push({ type: "hotel", layer: layers.hotel });

        layersToFilter.forEach(({ type, layer }) => {
          if (!layer) return;

          // Get all features from the source
          const source = layer.getSource();
          const allFeatures = source.getFeatures();

          // Filter features that are within the region
          const filteredFeatures = allFeatures.filter((feature) => {
            const featureGeom = feature.getGeometry();
            return (
              featureGeom &&
              regionGeometry.intersectsExtent(featureGeom.getExtent())
            );
          });

          // Create a new source with only filtered features
          const newSource = new VectorSource({
            features: filteredFeatures.slice(),
          });

          // Preserve the style
          const style = layer.getStyle();
          if (style) {
            newSource.on("addfeature", () => {
              layer.setStyle(style);
            });
          }

          layer.setSource(newSource);
        });
      } catch (err) {
        console.warn("Could not filter facilities by region:", err);
      }
    } else {
      // If no region selected, reload all facilities based on equipment visibility
      const layersToReload = [];
      if (shouldShowSchools) layersToReload.push({ type: "school", icon: "icons/school-marker.png" });
      if (shouldShowHospitals) layersToReload.push({ type: "hospital", icon: "icons/hospital-marker.png" });
      if (shouldShowParks) layersToReload.push({ type: "park", icon: "icons/park-marker.png" });
      if (shouldShowHotels) layersToReload.push({ type: "hotel", icon: "icons/hotel-marker.png" });

      layersToReload.forEach(({ type, icon }) => {
        if (!layers[type]) return;
        
        loadFacilitiesLayer(type, icon).then((layer) => {
          if (layer) {
            layer.setStyle(layerStyles[type]);
            layers[type].setSource(layer.getSource());
          }
        });
      });

      // Hide layers not in equipment filter
      if (layers.school && !shouldShowSchools) layers.school.setVisible(false);
      if (layers.hospital && !shouldShowHospitals) layers.hospital.setVisible(false);
      if (layers.park && !shouldShowParks) layers.park.setVisible(false);
      if (layers.hotel && !shouldShowHotels) layers.hotel.setVisible(false);
    }
  }, [filters, layers, map, layerStyles]);

  // Display filtered facilities on map
  useEffect(() => {
    if (!map || Object.keys(layers).length === 0 || !facilities || facilities.length === 0) return;

    // Group facilities by type
    const facilitiesByType = {
      school: [],
      hospital: [],
      park: [],
      hotel: [],
    };

    facilities.forEach((facility) => {
      const type = facility.type;
      if (facilitiesByType[type]) {
        facilitiesByType[type].push(facility);
      }
    });

    const geoJsonFormat = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    // Update each layer with filtered facilities
    Object.entries(facilitiesByType).forEach(([type, typeFacilities]) => {
      if (!layers[type]) return;

      const source = layers[type].getSource();
      source.clear();

      // Add filtered facilities to the source
      typeFacilities.forEach((facility) => {
        // Create feature from facility data
        let geometry = null;
        try {
          if (typeof facility.geom === 'string') {
            geometry = JSON.parse(facility.geom);
          } else {
            geometry = facility.geom;
          }
        } catch (e) {
          console.error(`Failed to parse geometry for facility ${facility.id}:`, e);
          return;
        }

        const feature = {
          type: "Feature",
          geometry: geometry,
          properties: {
            id: facility.id,
            name: facility.name,
            type: facility.type,
            region_id: facility.region_id,
            ...facility.properties,
          },
        };

        const featureObj = geoJsonFormat.readFeature(feature);
        source.addFeature(featureObj);
      });
    });
  }, [facilities, layers, map]);

  // Highlight selected region and zoom
  useEffect(() => {
    if (!map || Object.keys(layers).length === 0) return;

    const { region = null, regionGeom = null, regionName = null } = filters;

    // Highlight selected region
    if (layers.regions) {
      layers.regions.setStyle((feature) => {
        const featureRegionName = feature.get("nom_region");
        const isSelected = featureRegionName === regionName;

        if (isSelected) {
          return new Style({
            fill: new Fill({
              color: getRegionColor(feature.get("code_region")),
              opacity: 1,
            }),
            stroke: new Stroke({ color: "#000", width: 3 }),
            text: new Text({
              text: featureRegionName,
              fill: new Fill({ color: "#000" }),
              stroke: new Stroke({ color: "#fff", width: 3 }),
            }),
          });
        }

        // Semi-transparent for non-selected regions
        return new Style({
          fill: new Fill({
            color: getRegionColor(feature.get("code_region")),
            opacity: 0.2,
          }),
          stroke: new Stroke({ color: "#1e3799", width: 1.5 }),
          text: new Text({
            text: featureRegionName,
            fill: new Fill({ color: "#000" }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
          }),
        });
      });
    }

    // Zoom to region extent
    if (region && regionGeom) {
      try {
        let feature;
        
        // Handle both WKT string and GeoJSON object formats
        if (typeof regionGeom === 'string') {
          // Assume it's WKT format
          const format = new WKT();
          feature = format.readFeature(regionGeom, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
        } else {
          // Assume it's GeoJSON object
          const geoJsonFormat = new GeoJSON({
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
          feature = geoJsonFormat.readFeature({
            type: "Feature",
            geometry: regionGeom,
            properties: {},
          });
        }
        
        if (feature && feature.getGeometry()) {
          const extent = feature.getGeometry().getExtent();
          map.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
        }
      } catch (err) {
        console.warn("Could not zoom to region:", err);
      }
    }
  }, [filters, layers, map]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <MapInteraction />
      <RotateNorthControl />
      <CoordinatesControl />
      <ZoomControl />
      <LayerSwitcherControl layers={layers} />
    </>
  );
}

export default MapContentLoader;
