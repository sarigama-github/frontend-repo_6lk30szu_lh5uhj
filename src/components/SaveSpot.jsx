import { useState } from "react";
import { MapPin, Save } from "lucide-react";

export default function SaveSpot({ onSave }) {
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onSave({ label: label || "My Parking", notes, latitude, longitude, savedAt: new Date().toISOString() });
        setLabel("");
        setNotes("");
      },
      (err) => {
        console.error(err);
        alert("Couldn't get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="w-full bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Save your parking spot</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g., P2 near Lift)"
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (e.g., Blue sedan, Ticket #)"
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleUseLocation}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow"
        >
          <Save className="h-4 w-4" /> Save with current location
        </button>
        <p className="text-xs text-gray-500">Uses your GPS to store coordinates so the widget can navigate back.</p>
      </div>
    </section>
  );
}
