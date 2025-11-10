import { Compass, Navigation, Trash2 } from "lucide-react";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function mapUrl(lat, lng) {
  const latlng = `${lat},${lng}`;
  return isIOS()
    ? `https://maps.apple.com/?daddr=${latlng}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${latlng}`;
}

export default function SpotList({ spots, onNavigate, onDelete }) {
  if (!spots.length) {
    return (
      <div className="w-full text-center text-gray-500 text-sm">No saved spots yet. Save your first one above.</div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 bg-white/70 backdrop-blur rounded-xl border border-gray-200 overflow-hidden">
      {spots.map((s) => (
        <li key={s.id} className="p-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                <Compass className="h-4 w-4 text-blue-600" />
                {s.label}
              </span>
              <span className="text-xs text-gray-400">• saved {new Date(s.savedAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{s.notes || "No notes"}</p>
            <p className="text-xs text-gray-400 mt-1">Lat {s.latitude.toFixed(5)}, Lng {s.longitude.toFixed(5)}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={mapUrl(s.latitude, s.longitude)}
              target="_blank"
              rel="noreferrer"
              onClick={() => onNavigate?.(s)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              <Navigation className="h-4 w-4" /> Navigate
            </a>
            <button
              onClick={() => onDelete?.(s.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
