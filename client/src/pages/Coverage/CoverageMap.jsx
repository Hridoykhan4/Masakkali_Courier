import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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
      <div className="h-112.5 rounded-2xl overflow-hidden shadow-xl border border-base-300 relative z-10">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          // --- MOBILE OPTIMIZATION ---
          scrollWheelZoom={false} // Prevents accidental zooming while scrolling page
          dragging={L.Browser.mobile ? false : true} // Disables drag on mobile so users can scroll past it
          tap={false} // Fixes double-tap issues on mobile
          className="h-full w-full"
          style={{ zIndex: 1 }} // Force low z-index
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToDistrict district={matchedDistrict} />

          {coverageData.map((dist) => (
            <Marker
              key={dist.district}
              position={[dist.latitude, dist.longitude]}
              ref={(ref) => (markerRefs.current[dist.district] = ref)}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-primary">{dist.district}</h3>
                  <p className="text-xs text-gray-600 italic">{dist.region}</p>
                  <div className="mt-2 text-xs">
                    <span className="font-semibold text-gray-700">Areas:</span>{" "}
                    {dist.covered_area.slice(0, 3).join(", ")}...
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Helper for mobile users */}
        {L.Browser.mobile && (
          <div className="absolute bottom-2 right-2 z-401 bg-white/80 px-2 py-1 rounded text-[10px] pointer-events-none">
            Use two fingers to move map
          </div>
        )}
      </div>
    </section>
  );
};

export default CoverageMap;
