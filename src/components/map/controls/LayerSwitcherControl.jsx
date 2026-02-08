// import { Label } from "../../ui/label";
// import { Checkbox } from "../../ui/checkbox";
// import {
//   Route,
//   MapPin,
//   GraduationCap,
//   Building2,
//   TreePine,
// } from "lucide-react";

// const getLayerIcon = (name) => {
//   switch (name) {
//     case "road":
//       return <Route className="h-4 w-4" />;
//     case "district":
//       return <MapPin className="h-4 w-4" />;
//     case "school":
//       return <GraduationCap className="h-4 w-4" />;
//     case "hospital":
//       return <Building2 className="h-4 w-4" />;
//     case "park":
//       return <TreePine className="h-4 w-4" />;
//     default:
//       return <MapPin className="h-4 w-4" />;
//   }
// };

// const getLayerColor = (name) => {
//   switch (name) {
//     case "road":
//       return { backgroundColor: "#3b82f6", borderColor: "#3b82f6" }; // Blue
//     case "district":
//       return { backgroundColor: "#f59e0b", borderColor: "#f59e0b" }; // Amber
//     case "school":
//       return { backgroundColor: "#ef4444", borderColor: "#ef4444" }; // Red
//     case "hospital":
//       return { backgroundColor: "#3b82f6", borderColor: "#3b82f6" }; // Blue

//     case "park":
//       return { backgroundColor: "#22c55e", borderColor: "#22c55e" }; // Green
//     default:
//       return { backgroundColor: "#6b7280", borderColor: "#6b7280" }; // Gray
//   }
// };

// export default function LayerSwitcherControl({ layers }) {
//   if (!layers || Object.keys(layers).length === 0) return null;

//   const toggle = (key) => {
//     const layer = layers[key];
//     layer.setVisible(!layer.getVisible());
//   };

//   return (
//     <div className="absolute z-50 top-4 left-4 bg-white p-3 rounded shadow">
//       <div className="p-4 w-56 animate-slide-in-left">
//         <h3 className="font-semibold text-lg mb-4 text-foreground">Layers</h3>
//         <div className="space-y-3">
//           {Object.entries(layers).map(([key, layer]) => (
//             <label
//               key={key}
//               className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
//             >
//               <Checkbox
//                 checked={layer.getVisible()}
//                 onCheckedChange={() => toggle(key)}
//                 className="border-2"
//                 style={{
//                   borderColor: getLayerColor(key).borderColor,
//                   backgroundColor: getLayerColor(key).backgroundColor,
//                 }}
//               />
//               <span className="flex items-center gap-2 text-sm font-medium text-foreground">
//                 {getLayerIcon(key)}
//                 {key.charAt(0).toUpperCase() + key.slice(1) + "s"}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { Checkbox } from "../../ui/checkbox";
import {
  Route,
  MapPin,
  GraduationCap,
  Building2,
  TreePine,
  Layers,
} from "lucide-react";

const getLayerIcon = (name) => {
  switch (name) {
    case "road":
      return <Route className="h-4 w-4" />;
    case "regions":
      return <MapPin className="h-4 w-4" />;
    case "school":
      return <GraduationCap className="h-4 w-4" />;
    case "hospital":
      return <Building2 className="h-4 w-4" />;
    case "park":
      return <TreePine className="h-4 w-4" />;
    default:
      return <Layers className="h-4 w-4" />;
  }
};

const getLayerColor = (name) => {
  switch (name) {
    case "region":
      return "#f59e0b";
    case "school":
      return "#ef4444";
    case "hospital":
      return "#3b82f6";
    case "park":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

export default function LayerSwitcherControl({ layers }) {
  if (!layers || Object.keys(layers).length === 0) return null;

  const handleToggle = (key) => {
    console.log(
      "Current layers state:",
      Object.keys(layers).map((k) => `${k}: ${layers[k].getVisible()}`),
    );
    const layer = layers[key];
    if (!layer) return;
    // layer.setVisible(checked);
    layer.setVisible(!layer.getVisible());
  };

  return (
    <div className="absolute z-50 top-4 left-4 bg-white p-4 rounded-lg shadow-lg w-60">
      <h3 className="font-semibold text-lg mb-4">Layers</h3>

      <div className="space-y-3">
        {Object.entries(layers).map(([key, layer]) => (
          <label
            key={key}
            className="flex items-center gap-3 cursor-pointer hover:bg-muted/40 p-2 rounded-md"
          >
            <Checkbox
              checked={layer.getVisible()}
              onCheckedChange={() => handleToggle(key)}
              //   (checked) =>
              //   handleToggle(key, Boolean(checked))
              // }
              style={{
                borderColor: getLayerColor(key),
                backgroundColor: getLayerColor(key),
              }}
            />

            <span className="flex items-center gap-2 text-sm font-medium">
              {getLayerIcon(key)}
              {key.charAt(0).toUpperCase() + key.slice(1) + "s"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
