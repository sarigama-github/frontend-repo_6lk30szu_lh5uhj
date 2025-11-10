import React from 'react';
import { Navigation, Trash2 } from 'lucide-react';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function mapUrl(lat, lng, label = 'Saved Spot') {
  if (isIOS()) {
    const q = encodeURIComponent(`${label}`);
    return `maps://?q=${q}&ll=${lat},${lng}`;
  }
  const q = encodeURIComponent(`${label}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${q}`;
}

export default function SpotList({ items, onDelete, onNavigate }) {
  if (!items?.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-semibold mb-1">Saved spots</h2>
        <p className="text-sm text-gray-500">No spots yet. Save your first parking spot to see it here.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-4">
        <h2 className="text-base font-semibold">Saved spots</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {items.map((s) => (
          <li key={s.id} className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-gray-500">
                {s.latitude.toFixed(5)}, {s.longitude.toFixed(5)} • {new Date(s.savedAt).toLocaleString()}
              </p>
              {s.notes && <p className="text-sm text-gray-600 mt-1">{s.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
              <a
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
                href={mapUrl(s.latitude, s.longitude, s.label)}
                target="_blank"
                rel="noreferrer"
                onClick={() => onNavigate?.(s)}
              >
                <Navigation className="h-4 w-4" />
                Navigate
              </a>
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700"
                onClick={() => onDelete?.(s.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
