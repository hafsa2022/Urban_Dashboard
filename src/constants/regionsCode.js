export const getRegionColor = (code) => {
  const colors = {
    1: "#1f77b4",
    2: "#ff7f0e",
    3: "#2ca02c",
    4: "#d62728",
    5: "#9467bd",
    6: "#8c564b",
    7: "#e377c2",
    8: "#7f7f7f",
    9: "#bcbd22",
    10: "#17becf",
    11: "#4daf4a",
    12: "#984ea3",
  };

  return colors[code] || "#999";
};
