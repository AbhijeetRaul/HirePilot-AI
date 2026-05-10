"use client";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-zinc-900 p-6 border-r border-white/10">
      <h1 className="text-3xl font-bold text-white mb-10">
        HirePilot AI
      </h1>

      <div className="space-y-4">
        <button className="w-full bg-white text-black py-3 rounded-xl font-semibold">
          Dashboard
        </button>

        <button className="w-full bg-white/10 text-white py-3 rounded-xl">
          Resume History
        </button>
      </div>
    </div>
  );
}