import { Info } from "lucide-react";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export default function PlatformTips() {
  const ios = isIOS();
  return (
    <div className="mt-4 text-[12px] text-gray-500 flex items-start gap-2">
      <Info className="h-4 w-4 mt-[2px]" />
      {ios ? (
        <p>
          Tip: Add to Home Screen via Share → Add to Home Screen for quick access like a widget. Long-press to get quick actions.
        </p>
      ) : (
        <p>
          Tip: On Android, tap the browser menu and choose Add to Home screen to install. Navigation opens in Google Maps.
        </p>
      )}
    </div>
  );
}
