import { Checkbox } from "../../ui/checkbox";
import {
  Route,
  MapPin,
  GraduationCap,
  Building2,
  TreePine,
  Layers,
  Hotel,
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
    case "hotel":
      return <Hotel className="h-4 w-4" />;
    case "park":
      return <TreePine className="h-4 w-4" />;
    default:
      return <Layers className="h-4 w-4" />;
  }
};

const getLayerColor = (name) => {
  switch (name) {
    case "regions":
      return "#800080";
    case "school":
      return "#ef4444";
    case "hospital":
      return "#3b82f6";
    case "hotel":
      return "#f59e0b";
    case "park":
      return "#22c55e";
    default:
      return "#6b7280";
  }
};

export default function LayerSwitcherControl({ layers }) {
  if (!layers || Object.keys(layers).length === 0) return null;

  const handleToggle = (key) => {
    const layer = layers[key];
    if (!layer) return;
    // layer.setVisible(checked);
    layer.setVisible(!layer.getVisible());
  };

  return (
    <div className="absolute z-50 top-4 left-4 bg-white p-4 rounded-lg shadow-lg w-50">
      <h3 className="font-semibold text-lg mb-4">Layers</h3>

      <div className="space-y-2">
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
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
