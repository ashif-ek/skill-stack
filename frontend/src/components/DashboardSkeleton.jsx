export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 lg:p-8 animate-pulse">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Skeleton */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-64 rounded bg-slate-200"></div>
            <div className="mt-2 h-4 w-48 rounded bg-slate-200"></div>
          </div>
          <div className="h-10 w-24 rounded-lg bg-slate-200"></div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Goals */}
          <div className="lg:col-span-8 space-y-6">
            <div className="mb-4 h-6 w-40 rounded bg-slate-200"></div>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Goal Card Skeletons */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-32 flex flex-col justify-between">
                  <div>
                    <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
                  </div>
                  <div className="h-2 w-full rounded bg-slate-100 mt-4"></div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Insights / Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Card Skeleton */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="h-10 w-full bg-slate-100 border-b border-slate-100"></div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3 h-20"></div>
                ))}
              </div>
            </div>

            {/* Pulse Skeleton */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-48">
              <div className="h-10 w-full bg-slate-100 border-b border-slate-100"></div>
              <div className="p-4 space-y-4">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
