"use client"
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🚽</div>
        <h1 className="text-2xl font-bold text-white mb-3">You&apos;re offline</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          No internet connection right now. Previously loaded toilets are still
          visible on the map from your last visit.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
