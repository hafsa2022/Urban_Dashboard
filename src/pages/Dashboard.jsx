import RotateNorthControl from "../components/map/controls/RotateNorthControl";
import CoordinatesControl from "../components/map/controls/CoordinatesControl";
import ZoomControl from "../components/map/controls/ZoomControl";
import MapComponent from "../components/map/Map";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <MapComponent center={[0, 0]} zoom={2}>
        <RotateNorthControl />
        <CoordinatesControl />
        <ZoomControl />
      </MapComponent>
    </div>
  );
}
export default Dashboard;
