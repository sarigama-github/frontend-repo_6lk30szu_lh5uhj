import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import SaveSpot from "./components/SaveSpot";
import SpotList from "./components/SpotList";
import CompactBar from "./components/CompactBar";

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

function App() {
  const [spots, setSpots] = useState(() => {
    try {
      const raw = localStorage.getItem("parknote-spots");
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("parknote-spots", JSON.stringify(spots));
  }, [spots]);

  const addSpot = (data) => {
    const id = crypto.randomUUID();
    setSpots((prev) => [{ id, ...data }, ...prev].slice(0, 20));
  };

  const deleteSpot = (id) => setSpots((prev) => prev.filter((s) => s.id !== id));

  const lastSpot = useMemo(() => spots[0], [spots]);

  const quickSave = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        addSpot({
          label: "My Parking",
          notes: "",
          latitude,
          longitude,
          savedAt: new Date().toISOString(),
        });
      },
      () => alert("Couldn't get your location. Please allow location access."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle PWA shortcuts: /?action=save or /?action=go
  const handledShortcut = useRef(false);
  useEffect(() => {
    if (handledShortcut.current) return;
    handledShortcut.current = true;
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (!action) return;

    if (action === "save") {
      quickSave();
    } else if (action === "go") {
      if (lastSpot) {
        const url = mapUrl(lastSpot.latitude, lastSpot.longitude);
        window.location.href = url;
      } else {
        alert("No saved spot yet. Save a spot first.");
      }
    }
  }, [lastSpot]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50">
      <div className="max-w-md mx-auto px-3 sm:px-4 py-5">
        <Header />

        <div className="mt-4 grid grid-cols-1 gap-4">
          <CompactBar lastSpot={lastSpot} onQuickSave={quickSave} />
          <SaveSpot onSave={addSpot} />

          {lastSpot && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm">
              Last saved: <span className="font-medium">{lastSpot.label}</span> at {" "}
              {new Date(lastSpot.savedAt).toLocaleTimeString()}
            </div>
          )}

          <SpotList spots={spots} onDelete={deleteSpot} />
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          Privacy-friendly: your locations are stored only on your device and available offline.
        </footer>
      </div>
    </div>
  );
}

export default App;
