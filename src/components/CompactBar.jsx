import { Save, Navigation } from "lucide-react";

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

export default function CompactBar({ lastSpot, onQuickSave }) {
  const handleNavigate = () => {
    if (!lastSpot) return;
    const url = mapUrl(lastSpot.latitude, lastSpot.longitude);
    window.open(url, "_blank", "noreferrer");
  };

  const disabled = !lastSpot;

  return (
    <section className="w-full rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onQuickSave}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700 active:scale-[0.99]"
        >
          <Save className="h-4 w-4" /> Save
        </button>
        <button
          onClick={handleNavigate}
          disabled={disabled}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium active:scale-[0.99] ${
            disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          <Navigation className="h-4 w-4" /> Go
        </button>
      </div>
      {lastSpot ? (
        <p className="mt-2 text-[11px] leading-tight text-gray-500 truncate">
          Last: {lastSpot.label} • {new Date(lastSpot.savedAt).toLocaleTimeString()}
        </p>
      ) : (
        <p className="mt-2 text-[11px] leading-tight text-gray-400">No spot yet — tap Save</p>
      )}
    </section>
  );
}
