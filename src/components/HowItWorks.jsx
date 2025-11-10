import { Smartphone, Save, Navigation, Share2 } from "lucide-react";

export default function HowItWorks() {
  const items = [
    {
      icon: Smartphone,
      title: "Open the app",
      text: "Use it directly or add as a widget/shortcut on your iPhone.",
    },
    { icon: Save, title: "Save spot", text: "Tap save to store your current GPS location." },
    {
      icon: Navigation,
      title: "Navigate back",
      text: "One tap opens Apple Maps and guides you to your car.",
    },
    { icon: Share2, title: "Share if needed", text: "Send the location to friends or family." },
  ];

  return (
    <section id="how" className="mt-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="p-4 rounded-xl border border-gray-200 bg-white/60">
            <Icon className="h-5 w-5 text-blue-600" />
            <h4 className="mt-2 font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
