import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FlyToDistrict = ({ district }) => {
  const map = useMap();

  useEffect(() => {
    if (!district) return;

    map.flyTo([district.latitude, district.longitude], 10, { duration: 1.2 });
  }, [district, map]);

  return null;
};

const CoverageMap = ({ coverageData = [] }) => {
  const [search, setSearch] = useState("");
  const markerRefs = useRef({});

  const matchedDistrict = useMemo(() => {
    if (!search.trim()) return null;

    return coverageData.find((item) =>
      item.district.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coverageData]);

  useEffect(() => {
    if (!matchedDistrict) return;

    const marker = markerRefs.current[matchedDistrict.district];
    marker?.openPopup();
  }, [matchedDistrict]);



  return (
    <section className="max-w-6xl mx-auto px-4 py-2">
      {/* 🔍 Search Box */}
      <input
        type="text"
        placeholder="Search district (e.g. Dhaka, Bogura)"
        className="input input-bordered w-full max-w-md mx-auto block mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🗺️ Map */}
      <div className="h-112.5 rounded-xl overflow-hidden shadow-md">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✈️ Fly controller */}
          <FlyToDistrict district={matchedDistrict} />

          {/* 📌 Markers */}
          {coverageData.map((district) => (
            <Marker
              key={district.district}
              position={[district.latitude, district.longitude]}
              ref={(ref) => (markerRefs.current[district.district] = ref)}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{district.district}</h3>
                  <p className="text-sm">Region: {district.region}</p>
                  <p className="text-sm">
                    Covered Areas: {district.covered_area.join(", ")}
                  </p>
                  <p className="text-xs font-medium text-green-600">
                    Status: {district.status}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default CoverageMap;
