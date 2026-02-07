// // components/map/LayerSwitcherControl.jsx
// import { useContext } from "react";
// import MapContext from "../../../hooks/MapContext";

// const LayerSwitcherControl = () => {
//   const { map } = useContext(MapContext);

//   const toggleLayer = (index) => {
//     map.getLayers().forEach((layer, i) => {
//       layer.setVisible(i === index);
//     });
//   };



//   return (
//     <div className="absolute top-4 left-4 bg-white rounded-sm shadow-lg p-4 w-48 z-50">
//       <h3 className="font-semibold mb-2">Layers</h3>
//       <hr className="mb-2" />

//       <label className="flex gap-2">
//         <input type="checkbox" name="layer" onChange={() => toggleLayer(0)} defaultChecked />
//         OSM
//       </label>

//       <label className="flex gap-2">
//         <input type="checkbox" name="layer" onChange={() => toggleLayer(1)} />
//         Satellite
//       </label>
//     </div>
//   );
// };

// export default LayerSwitcherControl;

// export default function LayerSwitcher({ layers }) {
//   const toggle = (key) => {
//     const layer = layers[key];
//     layer.setVisible(!layer.getVisible());
//   };

//   return (
//     <div className="absolute z-50 top-4 left-4 bg-white p-3 rounded-sm shadow">
//       <h4 className="font-bold mb-2" >Layers</h4>
//       <hr className="mb-2" />

//       {Object.keys(layers).map((key) => (
//         <label key={key} className="flex gap-2 text-sm">
//           <input
//             type="checkbox"
//             defaultChecked={layers[key].getVisible()}
//             onChange={() => toggle(key)}
//           />
//           {key}
//         </label>
//       ))}
//     </div>
//   );
// }
import React from "react";
export default function LayerSwitcherControl({ layers }) {
  if (!layers || Object.keys(layers).length === 0) return null;

  const toggle = (key) => {
    const layer = layers[key];
    layer.setVisible(!layer.getVisible());
  };

  return (
    <div className="absolute z-50 top-4 left-4 bg-white p-3 rounded shadow">
      <h4 className="font-bold mb-2">Layers</h4>

      {Object.entries(layers).map(([key, layer]) => (
        <label key={key} className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={layer.getVisible()}
            onChange={() => toggle(key)}
          />
          {key}
        </label>
      ))}
    </div>
  );
}
