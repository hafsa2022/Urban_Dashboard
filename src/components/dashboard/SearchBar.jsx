// import React, { useContext, useEffect, useRef } from "react";
// import MapContext from "./../../../hooks/MapContext";
// // Assuming 'ol-geocoder' is installed or similar library is used
// import Geocoder from "ol-geocoder";
// import { motion } from "framer-motion";

// const SearchControl = () => {
//   const { map } = useContext(MapContext);
//   const searchInputRef = useRef(null); // Ref for your search input container

//   useEffect(() => {
//     if (!map) return;

//     // Instantiate geocoder with the React ref element
//     const geocoder = new Geocoder("nominatim", {
//       // Use 'nominatim', 'google', etc.
//       provider: "osm", // Example provider
//       placeholder: "Search for a location...",
//       target: searchInputRef.current, // Target the specific DOM element
//       limit: 5,
//       autoComplete: true,
//     });

//     map.addControl(geocoder);

//     // Listen for the 'addresschosen' event to handle the result
//     geocoder.on("addresschosen", function (evt) {
//       const coord = evt.coordinate;
//       map.getView().centerOn(coord, map.getSize(), [500, 500]); // Center the map
//       console.log("Chosen address:", evt.address.formatted);
//     });

//     return () => {
//       map.removeControl(geocoder);
//     };
//   }, [map]);

//   return (
//     <motion.div className="map-controls-top-left">
//       <motion.button
//         ref={searchInputRef}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="glass-card px-3 py-2 flex items-center justify-center text-foreground hover:text-primary transition-colors"
//       >
//         Search
//       </motion.button>
//     </motion.div>
//   );
// };

// export default SearchControl;
// import React, { useContext, useEffect, useRef, useState } from "react";
// import MapContext from "./../../../hooks/MapContext";
// import Geocoder from "ol-geocoder";
// import "ol-geocoder/dist/ol-geocoder.min.css";
// import { motion } from "framer-motion";

// const SearchControl = () => {
//   const { map } = useContext(MapContext);
//   const searchContainerRef = useRef(null);
//   const [isFocused, setIsFocused] = useState(false);

//   useEffect(() => {
//     if (!map || !searchContainerRef.current) return;

//     const geocoder = new Geocoder("nominatim", {
//       provider: "osm",
//       lang: "En",
//       countrycodes: "ma",
//       placeholder: "Search location...",
//       limit: 5,
//       autoComplete: true,
//       target: searchContainerRef.current, // ✅ div container
//     });

//     map.addControl(geocoder);

//     geocoder.on("addresschosen", (evt) => {
//       const view = map.getView();

//       view.animate({
//         center: evt.coordinate,
//         zoom: 5,
//         duration: 1000,
//       });

//       console.log("Chosen address:", evt.address.formatted);
//     });

//     return () => {
//       map.removeControl(geocoder);
//     };
//   }, [map]);

//   return (
//     <motion.div
//       className="map-controls-top-left glass-card"
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => {
//         setIsFocused(!isFocused);
//       }}
//     >
//       Search
//       {isFocused && (
//         <motion.div
//           ref={searchContainerRef}
//           className=" p-2"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//         />
//       )}
//     </motion.div>
//   );
// };

// export default SearchControl;

// components/controls/SearchControl.jsx
// import React, { useContext, useEffect, useRef } from "react";
// import MapContext from "./../../../hooks/MapContext";
// import Geocoder from "ol-geocoder";
// import { motion } from "framer-motion";

// const SearchControl = () => {
//   const { map } = useContext(MapContext);
//   const searchRef = useRef(null);
//   const geocoderRef = useRef(null);
//   //   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (!map || !searchRef.current || geocoderRef.current) return;

//     const geocoder = new Geocoder("nominatim", {
//       provider: "osm",
//       lang: "en",
//       countrycodes: "ma",
//       placeholder: "Search location...",
//       limit: 5,
//       autoComplete: true,
//       target: searchRef.current,
//     });
//     map.addControl(geocoder);

//     geocoder.on("addresschosen", (evt) => {
//       map.getView().animate({
//         center: evt.coordinate,
//         zoom: 8,
//         duration: 1000,
//       });
//       console.log("Selected:", evt.address.formatted);
//     });

//     geocoderRef.current = geocoder;
//     // console.log("Geocoder initialized");
//   }, [map]);

//   //   const handelControls = () => {
//   //     if (open && geocoderRef.current) {
//   //       map.removeControl(geocoderRef.current);
//   //     } else if (!open && geocoderRef.current) {
//   //       map.addControl(geocoderRef.current);
//   //     }
//   //   };
//   return (
//     <motion.div
//       ref={searchRef}
//       className="absolute z-50 glass-card "
      
//     />
//   );
// };

// export default SearchControl;
// components/map/SearchControl.jsx
const SearchBar = () => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-100 z-50">
      <div className="flex bg-white rounded-sm shadow">
        <input
          type="text"
          placeholder="Search for locations..."
          className="flex-1 p-3 outline-none"
        />
        <button className="bg-[#293c56] text-white px-6 rounded-r-sm hover:bg-[#1f2a40] transition-colors">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
