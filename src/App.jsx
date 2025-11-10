import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import SaveSpot from "./components/SaveSpot";
import SpotList from "./components/SpotList";
import HowItWorks from "./components/HowItWorks";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Header />

        <div className="mt-6 grid grid-cols-1 gap-6">
          <SaveSpot onSave={addSpot} />

          {lastSpot && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
              Last saved: {lastSpot.label} at {new Date(lastSpot.savedAt).toLocaleTimeString()} 
              — tap Navigate on any item below to open Apple Maps.
            </div>
          )}

          <SpotList spots={spots} onDelete={deleteSpot} />

          <HowItWorks />
        </div>

        <footer className="mt-10 text-center text-xs text-gray-500">
          Privacy-friendly: your locations are stored only on your device.
        </footer>
      </div>
    </div>
  );
}

export default App;
