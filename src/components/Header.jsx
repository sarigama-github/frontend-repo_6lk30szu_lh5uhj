import { Car, MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-blue-600 text-white grid place-items-center shadow-lg shadow-blue-600/30">
          <Car className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">ParkNote</h1>
          <p className="text-sm text-gray-500">Remember where you parked — fast.</p>
        </div>
      </div>
      <a
        href="#how"
        className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 text-sm font-medium"
      >
        <MapPin className="h-4 w-4" />
        How it works
      </a>
    </header>
  );
}
