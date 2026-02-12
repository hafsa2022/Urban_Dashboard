import React from "react";
import { X, Star, BookOpen, Building2, Trees, MapPin } from "lucide-react";

const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "school":
      return {
        icon: <BookOpen size={32} />,
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    case "hospital":
      return {
        icon: <Building2 size={32} />,
        color: "text-red-600",
        bg: "bg-red-100",
      };
    case "park":
      return {
        icon: <Trees size={32} />,
        color: "text-green-600",
        bg: "bg-green-100",
      };
    default:
      return {
        icon: <MapPin size={32} />,
        color: "text-gray-600",
        bg: "bg-gray-100",
      };
  }
};

const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={`${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "fill-yellow-400 text-yellow-400 opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className="text-lg font-bold text-gray-900">{rating}</span>
      )}
    </div>
  );
};

export default function FeatureDetailsDialog({ feature, onClose }) {
  if (!feature) return null;

  const properties = feature.getProperties();
  const rating = properties.rating || 0;
  const typeIcon = getTypeIcon(properties.type);

  // Filter out id and geometry fields
  const filteredProperties = Object.entries(properties).filter(
    ([key]) =>
      !key.toLowerCase().includes("id") &&
      !key.toLowerCase().includes("geometry"),
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 shadow-lg">
      <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#293c56] to-[#1f2f44] px-6 py-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {properties.name || properties.nom_region || "Unknown Feature"}
            </h2>
            <div className="flex items-center gap-4">
              {/* <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm font-semibold rounded-full capitalize">
                {properties.type}
              </span> */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition ml-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Icon and Rating Section */}
          <div className="flex items-center justify-between">
            <div
              className={`${typeIcon.bg} ${typeIcon.color} rounded-2xl p-4 flex items-center justify-center`}
            >
              {typeIcon.icon}
            </div>
            {rating > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2 uppercase font-semibold tracking-wide">
                  Rating
                </p>
                <StarRating rating={rating} />
              </div>
            )}
          </div>

          {/* Details Grid */}
          {filteredProperties.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProperties.map(([key, value]) => {
                  if (key.toLowerCase().includes("area")) return null;
                  return (
                    <div
                      key={key}
                      className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                    >
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-base font-semibold text-gray-900 wrap-break-word">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </div>
                  );
                })}
                {/* ))} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
