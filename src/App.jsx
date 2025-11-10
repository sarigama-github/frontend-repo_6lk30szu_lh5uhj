import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import SaveSpot from "./components/SaveSpot";
import SpotList from "./components/SpotList";
import HowItWorks from "./components/HowItWorks";
import CompactBar from "./components/CompactBar";
import PlatformTips from "./components/PlatformTips";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50">
      <div className="max-w-md mx-auto px-3 sm:px-4 py-5">
        <Header />

        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Compact top bar for small-screen / widget-like usage */}
          <CompactBar lastSpot={lastSpot} onQuickSave={quickSave} />

          {/* Full form for detailed labels/notes */}
          <SaveSpot onSave={addSpot} />

          {lastSpot && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm">
              Last saved: <span className="font-medium">{lastSpot.label}</span> at {" "}
              {new Date(lastSpot.savedAt).toLocaleTimeString()}
            </div>
          )}

          <SpotList spots={spots} onDelete={deleteSpot} />

          <HowItWorks />
          <PlatformTips />
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500">
          Privacy-friendly: your locations are stored only on your device.
        </footer>
      </div>
    </div>
  );
}

export default App;
