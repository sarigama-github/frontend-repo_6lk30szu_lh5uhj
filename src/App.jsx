import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SaveSpot from './components/SaveSpot';
import SpotList from './components/SpotList';
import CompactBar from './components/CompactBar';

const STORAGE_KEY = 'parknote-spots';

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

export default function App() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSpots(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to parse storage', e);
    }
  }, []);

  const addSpot = useCallback((spot) => {
    setSpots((prev) => {
      const next = [spot, ...prev].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteSpot = useCallback((id) => {
    setSpots((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const lastSpot = useMemo(() => spots[0] || null, [spots]);

  const quickSave = useCallback(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const item = {
          id: `${Date.now()}`,
          label: 'My car',
          notes: '',
          latitude,
          longitude,
          savedAt: new Date().toISOString(),
        };
        addSpot(item);
      },
      (err) => console.warn('Quick save failed', err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [addSpot]);

  const quickGo = useCallback(() => {
    if (!lastSpot) return;
    const url = mapUrl(lastSpot.latitude, lastSpot.longitude, lastSpot.label);
    window.open(url, '_blank');
  }, [lastSpot]);

  // Handle PWA shortcut actions via URL params: ?action=save or ?action=go
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'save') quickSave();
    if (action === 'go') quickGo();
  }, [quickSave, quickGo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 grid gap-6">
        <SaveSpot onSaved={addSpot} />
        <SpotList items={spots} onDelete={deleteSpot} onNavigate={() => {}} />

        <p className="text-xs text-gray-500">
          Tip: Add this to your Home Screen for quicker access. It works offline once opened at least once.
        </p>
      </main>

      <CompactBar onQuickSave={quickSave} onQuickGo={quickGo} hasSpots={!!lastSpot} />
    </div>
  );
}
