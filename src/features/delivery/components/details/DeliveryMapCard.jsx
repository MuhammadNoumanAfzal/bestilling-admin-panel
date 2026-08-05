import { MapPin, MapPinned } from "lucide-react";

const coverageChipStyles = {
  Active: "bg-[#fff1e7] text-[#cf6e38]",
  Limited: "bg-[#f3f0ed] text-[#6f645d]",
  Inactive: "bg-[#f6f2ef] text-[#8d8077]",
};

function CoverageChip({ label }) {
  return (
    <span
      className={[
        "inline-flex h-7 items-center rounded-full px-2.5 text-[10px] font-bold leading-none",
        coverageChipStyles[label] || coverageChipStyles.Active,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function DeliveryMapCard({ area }) {
  const polygons = Array.isArray(area.map?.polygons) ? area.map.polygons : [];
  const markers = Array.isArray(area.map?.markers) ? area.map.markers : [];
  const center = area.map?.center || {};
  const bounds = area.map?.bounds || {};
  const polygonPoints = polygons.reduce(
    (total, polygon) => total + (Array.isArray(polygon?.points) ? polygon.points.length : 0),
    0,
  );

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#ddd4cd] bg-white shadow-[0_10px_24px_rgba(55,31,13,0.05)]">
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#18120f]">Coverage Map: {area.city}</h2>
            <p className="mt-1.5 text-[14px] leading-6 text-[#7a6d66]">
              Visualizing active delivery radiuses and vendor clusters across the selected area.
            </p>
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <CoverageChip label="Active" />
            <CoverageChip label="Limited" />
            <CoverageChip label="Inactive" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[16px] border border-[#e8ddd5] bg-[linear-gradient(180deg,#fffaf6_0%,#fff3ea_100%)] p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[16px] border border-[#eadfd6] bg-white px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Map Center</p>
              <p className="mt-2 text-[15px] font-semibold text-[#18120f]">
                {center.lat != null && center.lng != null ? `${center.lat}, ${center.lng}` : "Not configured"}
              </p>
              <p className="mt-1 text-[12px] text-[#7a6d66]">Zoom level: {area.map?.zoom ?? 10}</p>
            </div>

            <div className="rounded-[16px] border border-[#eadfd6] bg-white px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Coverage Shapes</p>
              <p className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#18120f]">{polygons.length}</p>
              <p className="mt-1 text-[12px] text-[#7a6d66]">{polygonPoints} polygon points loaded</p>
            </div>

            <div className="rounded-[16px] border border-[#eadfd6] bg-white px-4 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Coverage Markers</p>
              <p className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#18120f]">{markers.length}</p>
              <p className="mt-1 text-[12px] text-[#7a6d66]">Active map reference points</p>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] border border-[#eadfd6] bg-white px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8f86]">Map Bounds</p>
            <p className="mt-2 text-[14px] font-medium text-[#18120f]">
              {bounds.north != null && bounds.south != null && bounds.east != null && bounds.west != null
                ? `N ${bounds.north} / S ${bounds.south} / E ${bounds.east} / W ${bounds.west}`
                : "Not configured"}
            </p>
          </div>

          <div className="mt-4 rounded-[16px] border border-dashed border-[#eadfd6] bg-white/80 px-4 py-5">
            <div className="flex items-center gap-2 text-[#cf6e38]">
              <MapPinned size={16} />
              <p className="text-[13px] font-bold text-[#2b211b]">Map data connected</p>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-[#786d66]">
              The backend is returning polygon and marker coordinates for this delivery area. A visual GIS renderer can
              be added on top of this payload without changing the GraphQL integration.
            </p>
            {markers.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {markers.slice(0, 6).map((marker) => (
                  <span
                    key={marker.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#ead2c3] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4f4036]"
                  >
                    <MapPin size={13} className="text-[#cf6e38]" />
                    <span>{marker.label || marker.type || "Marker"}</span>
                  </span>
                ))}
              </div>
            ) : null}

            {polygons.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {polygons.slice(0, 6).map((polygon) => (
                  <span
                    key={polygon.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#ead2c3] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4f4036]"
                  >
                    <span>{polygon.label || `Polygon ${polygon.id}`}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
