![alt text](image.png)
🌍 Urban Dashboard

Urban Dashboard is a web-based geographic information system (GIS) application that visualizes urban facilities across regions using interactive maps, real-time statistics, and spatial analysis.

The application integrates React.js, Supabase (PostGIS), and OpenStreetMap to provide spatial data filtering, KPI visualization, and secure authentication.

🚀 Features
📊 Dashboard

Dynamic KPI cards displaying:

🏫 Schools

🏥 Hospitals

🏨 Hotels

🌳 Parks

Real-time updates based on selected filters

Interactive facilities statistics chart

🗺 Interactive Map

Powered by OpenStreetMap

Displays:

Regions (polygons)

Facilities (points)

Layer control (show/hide facility types)

Spatial filtering by region

Marker clustering

Search functionality for facilities by name

🔎 Filters

Filter by region

Filter by facility type:

School

Hospital

Hotel

Park

📈 Statistics

Pie chart visualization of facility distribution

KPI counters update dynamically based on applied filters

🔐 Authentication

JWT-based authentication

Secure login system

Protected routes

🛠 Tech Stack
Frontend

React.js

Tailwind CSS

Leaflet (OpenStreetMap)

Recharts / Chart library (for statistics)

JWT Authentication

Backend

Supabase

PostgreSQL

PostGIS (spatial queries)

GIS & Data Processing

OpenStreetMap (OSM) data

QGIS (used for reverse geocoding & spatial preparation)

GeoJSON format for map rendering

🗄 Database Structure
Facilities Table

id (UUID)

name (text)

type (school | hospital | hotel | park)

geom (geometry(Point, 4326))

region_id (foreign key)

properties (jsonb)

area (double precision)

Regions Table

id

name

geom (geometry(Polygon, 4326))

🌐 Spatial Queries Used

Examples of PostGIS queries used in the project:

Get facilities by region
SELECT *
FROM facilities
WHERE region_id = :regionId;

Filter by multiple facility types
SELECT *
FROM facilities
WHERE region_id = :regionId
AND type IN ('school', 'hospital');

Spatial intersection
SELECT f.*
FROM facilities f
JOIN regions r
ON ST_Contains(r.geom, f.geom);

📦 Installation
1️⃣ Clone repository
git clone https://github.com/hafsa2022/Urban_Dashboard.git
cd urban-dashboard

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

Create .env file:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run project
npm run dev

📊 Project Architecture


  src/
   ├── components/
   │   └── dashboard/
   │       ├── FilterSideBar
   │       ├── KpiCards
   │       ├── SearchBar
   │       ├── StatsCharts
   │   └── map
   │       └── controls
   │           ├── CoordinatesControl
   │           ├── LayerSwitcherControl
   │           ├── RotateNorthControl
   │           └── ZoomControl
   │       ├── FeatureDetailsDialog
   │       ├── FeaturePopup
   │       ├── Map
   │       ├── MapContentLoader
   │       ├── MapInteraction
   │    └── ui
   │        ├── button
   │        ├── card
   │        ├── checkbox
   │        ├── dropdown-menu
   │        ├── input
   │        └── label
   │   ├── NavBar
   │   ├── ProtectedRoute
   │ 
   ├── canstants/
   │   └── layers.js
   │   └── loadegionsLayer.js
   │   └── regionsCode.js
   │
   │── hooks/
   │   └── MapContext.js
   │   └── useAuth.js
   │   └── useFacilities.js
   │
   ├── lib/
   │   └── utils.js
   │
   ├── pages/
   │   ├── Auth
   │   ├── NotFound
   │   ├── Dashboard
   │   └── Profile
   │
   ├── utils/
   │   └── supasebase.js


🔎 Data Workflow

Extract facilities from OpenStreetMap

Process & clean spatial data in QGIS

Perform reverse geocoding

Export GeoJSON

Import into Supabase (PostGIS)

Connect frontend via Supabase client

🎯 Facility Types

Currently supported facility types:

School

Hospital

Hotel

Park

The system is scalable to support additional types.

🔮 Future Improvements

Add heatmap visualization

Add temporal data analysis

Add facility clustering optimization

Add role-based access control

Add advanced spatial analytics

Deploy production version

📸 Screenshot

Urban Dashboard interface includes:

Sidebar filters

KPI cards

Interactive Morocco map

Facilities statistics chart

Search functionality

👨‍💻 Author

Developed as a GIS + Web Mapping project integrating:

React

PostGIS

Supabase

OpenStreetMap

QGIS
