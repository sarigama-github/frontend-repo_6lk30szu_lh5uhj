import React from 'react';
import { Car, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow">
          <Car className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight">ParkNote</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> Save and find your parking spot
          </p>
        </div>
      </div>
    </header>
  );
}
