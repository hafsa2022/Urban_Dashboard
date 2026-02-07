/* ======================
   🏫 SCHOOLS (Morocco)
====================== */
export const mockSchools = [
  {
    id: "school-1",
    name: "Lycée Mohammed V",
    type: "school",
    coordinates: [-7.6223, 33.5928], // Casablanca
    properties: {
      students: 1200,
      rating: 4.6,
      address: "Centre Ville, Casablanca",
      district: "Anfa"
    }
  },
  {
    id: "school-2",
    name: "École Al Khawarizmi",
    type: "school",
    coordinates: [-7.6351, 33.5731],
    properties: {
      students: 650,
      rating: 4.3,
      address: "Maarif, Casablanca",
      district: "Maarif"
    }
  },
  {
    id: "school-3",
    name: "Lycée Ibn Khaldoun",
    type: "school",
    coordinates: [-6.8416, 34.0209], // Rabat
    properties: {
      students: 900,
      rating: 4.7,
      address: "Agdal, Rabat",
      district: "Agdal"
    }
  }
];

/* ======================
   🏥 HOSPITALS
====================== */
export const mockHospitals = [
  {
    id: "hospital-1",
    name: "CHU Ibn Rochd",
    type: "hospital",
    coordinates: [-7.6485, 33.5684],
    properties: {
      beds: 1200,
      emergency: true,
      rating: 4.5,
      district: "Sidi Othmane"
    }
  },
  {
    id: "hospital-2",
    name: "Hôpital Cheikh Zaid",
    type: "hospital",
    coordinates: [-6.8498, 33.9687],
    properties: {
      beds: 650,
      emergency: true,
      rating: 4.8,
      district: "Souissi"
    }
  }
];

/* ======================
   🌳 PARKS
====================== */
export const mockParks = [
  {
    id: "park-1",
    name: "Parc de la Ligue Arabe",
    type: "park",
    coordinates: [-7.6281, 33.5892],
    properties: {
      area: 30,
      amenities: ["Walking Trails", "Garden"],
      district: "Centre Ville"
    }
  },
  {
    id: "park-2",
    name: "Jardin d’Essais Botaniques",
    type: "park",
    coordinates: [-6.8279, 34.0225],
    properties: {
      area: 17,
      amenities: ["Garden", "Lake"],
      district: "Agdal"
    }
  }
];
