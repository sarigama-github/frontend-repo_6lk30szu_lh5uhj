import React, { useCallback, useMemo, useState } from 'react';
import { LocateFixed, Save, NotebookPen } from 'lucide-react';

function getDeviceMapUrl(lat, lng, label = 'Saved Spot') {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    const q = encodeURIComponent(`${label}`);
    return `maps://?q=${q}&ll=${lat},${lng}`;
  }
  const q = encodeURIComponent(`${label}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${q}`;
}

export default function SaveSpot({ onSaved }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [label, setLabel] = useState('My car');
  const [notes, setNotes] = useState('');

  const canSave = useMemo(() => !!coords, [coords]);

  const locate = useCallback(() => {
    setLoading(true);
    setError('');
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device/browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to get location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const save = useCallback(() => {
    if (!coords) return;
    const item = {
      id: `${Date.now()}`,
      label: label?.trim() || 'My car',
      notes: notes?.trim() || '',
      latitude: coords.latitude,
      longitude: coords.longitude,
      savedAt: new Date().toISOString(),
    };
    try {
      const key = 'parknote-spots';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const next = [item, ...existing].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(next));
      onSaved?.(item);
    } catch (e) {
      console.error(e);
      setError('Failed to save locally. Check storage permissions.');
    }
  }, [coords, label, notes, onSaved]);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-base font-semibold mb-3">Save current spot</h2>

      <div className="grid gap-3">
        <div className="flex gap-2">
          <button
            onClick={locate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            <LocateFixed className="h-5 w-5" />
            {loading ? 'Locating…' : 'Use my location'}
          </button>
          {coords && (
            <a
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900"
              href={getDeviceMapUrl(coords.latitude, coords.longitude, label)}
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps
            </a>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Label</span>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Level 3, B12"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-600">Notes</span>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Landmark, timer, etc."
            />
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        <button
          onClick={save}
          disabled={!canSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
        >
          <Save className="h-5 w-5" /> Save spot
        </button>
      </div>
    </section>
  );
}
