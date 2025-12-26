import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CoverageMap = ({ coverageData }) => {

  const bdCenter = [23.685, 90.3563];

  return (
    <div className="h-112.5 z-0 w-full rounded-xl overflow-hidden">
      <MapContainer
        center={bdCenter}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* Map tiles */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker */}
        {coverageData.map((district, index) => (
          <Marker
            key={index}
            position={[district.latitude, district?.longitude]}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{district.district}</h3>
                <p className="text-sm text-gray-600">
                  Region: {district.region}
                </p>
                <p className="text-sm">
                  Areas: {district.covered_area.join(", ")}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  Status: {district.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
