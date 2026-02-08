import { X, Star, BookOpen, Building2, Trees } from "lucide-react";

const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "school":
      return <BookOpen size={20} className="text-blue-600" />;
    case "hospital":
      return <Building2 size={20} className="text-red-600" />;
    case "park":
      return <Trees size={20} className="text-green-600" />;
    default:
      return null;
  }
};

const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300"
          }`}
        />
      ))}
      {rating > 0 && (
        <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
      )}
    </div>
  );
};

export default function FeaturePopup({ feature, onClose, onViewDetails }) {
  if (!feature) return null;

  const properties = feature.getProperties();
  console.log("Feature properties:", properties);
  const rating = properties.rating || 0;

  return (
    <div className="absolute bg-white rounded-sm shadow-xl border border-gray-100 p-5 w-100 max-w-md z-40">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {getTypeIcon(properties.type)}
          <h3 className="font-bold text-gray-900 text-lg">
            {properties.name || properties.nom_region || "Unknown Feature"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {properties.type}
          </span>
          {rating > 0 && <StarRating rating={rating} />}
        </div>
      </div>

      <button
        onClick={() => onViewDetails(feature)}
        className="w-full bg-linear-to-r from-[#293c56] to-[#1f2f44] hover:from-[#1f2f44] hover:to-[#162334] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
      >
        View Details
      </button>
    </div>
  );
}
