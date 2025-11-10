import React from 'react';
import { Save, Navigation } from 'lucide-react';

export default function CompactBar({ onQuickSave, onQuickGo, hasSpots }) {
  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-30">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden grid grid-cols-2">
        <button
          onClick={onQuickSave}
          className="flex items-center justify-center gap-2 py-3 text-emerald-700 hover:bg-emerald-50"
        >
          <Save className="h-5 w-5" />
          Save now
        </button>
        <button
          onClick={onQuickGo}
          disabled={!hasSpots}
          className="flex items-center justify-center gap-2 py-3 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
        >
          <Navigation className="h-5 w-5" />
          Go to last
        </button>
      </div>
    </div>
  );
}
