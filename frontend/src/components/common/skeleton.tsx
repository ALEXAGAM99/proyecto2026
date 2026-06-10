interface SkeletonProps {
  isDarkMode: boolean;
}

export const PacienteSkeleton = ({ isDarkMode }: SkeletonProps) => (
  <div className="flex flex-col animate-pulse gap-6 p-2 h-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-100"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-6 w-32 rounded-lg ${isDarkMode ? "bg-emerald-500/20" : "bg-emerald-500/10"}`}
          />
          <div
            className={`h-2 w-48 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div
          className={`h-12 w-80 rounded-2xl ${isDarkMode ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-zinc-50"}`}
        />
        <div
          className={`h-12 w-12 rounded-2xl ${isDarkMode ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-zinc-50"}`}
        />
      </div>
    </div>

    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`border rounded-2xl p-5 shadow-sm ${
            isDarkMode
              ? "bg-zinc-900/40 border-zinc-800/50"
              : "bg-white border-gray-100/50"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div
                className={`w-14 h-14 rounded-2xl flex-shrink-0 ${isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50"}`}
              />
              <div className="space-y-3">
                <div
                  className={`h-6 w-64 rounded-lg ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
                />
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className={`h-4 w-28 rounded-md ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-24 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              />
              <div
                className={`h-10 w-10 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ConsultaSkeleton = ({ isDarkMode }: SkeletonProps) => (
  <div className={`h-full flex flex-col gap-4 animate-pulse p-2`}>
    <div className="flex flex-col md:flex-row gap-6 mt-3 mb-4 items-start md:items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-100"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-6 w-40 rounded-lg ${isDarkMode ? "bg-emerald-500/20" : "bg-emerald-500/10"}`}
          />
          <div
            className={`h-2 w-56 rounded-md ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div
        className={`h-10 w-56 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-gray-100"}`}
      />
    </div>

    <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div
            className={`h-12 w-full rounded-2xl ${isDarkMode ? "bg-zinc-900" : "bg-gray-100"}`}
          />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-16 w-full rounded-2xl ${isDarkMode ? "bg-zinc-900/50" : "bg-gray-50"}`}
            />
          ))}
        </div>
        <div
          className={`border-x px-4 ${isDarkMode ? "border-zinc-900" : "border-gray-100"} space-y-4`}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-14 w-full rounded-2xl ${isDarkMode ? "bg-zinc-900/50" : "bg-gray-50"}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div
          className={`p-4 rounded-xl flex justify-between ${isDarkMode ? "bg-zinc-900" : "bg-white shadow-sm"}`}
        >
          <div
            className={`h-5 w-48 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
          />
          <div
            className={`w-10 h-10 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-24 rounded-2xl border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}
            />
          ))}
        </div>
        <div
          className={`h-20 w-full rounded-3xl border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"}`}
        />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({
  isDarkMode,
  rows = 6,
  showStats = true,
}: SkeletonProps & { rows?: number; showStats?: boolean }) => (
  <div className={`w-full animate-pulse flex flex-col gap-4 p-2 h-full`}>
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-100"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-6 w-48 rounded ${isDarkMode ? "bg-emerald-500/20" : "bg-emerald-500/10"}`}
          />
          <div
            className={`h-2 w-64 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div
        className={`h-12 w-80 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-gray-100"}`}
      />
    </div>

    {showStats && (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-20 rounded-2xl border ${isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-100"}`}
          />
        ))}
      </div>
    )}

    <div
      className={`flex-1 border-4 rounded-[2.5rem] overflow-hidden ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100 shadow-sm"}`}
    >
      <div
        className={`h-14 flex items-center px-6 gap-4 border-b ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-100"}`}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full flex-1 ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        ))}
      </div>
      <div
        className={`${isDarkMode ? "divide-zinc-900" : "divide-gray-50"} divide-y`}
      >
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className={`h-20 flex items-center px-6 gap-4 ${isDarkMode ? "bg-zinc-900/20" : "bg-white"}`}
          >
            <div className="flex-1 space-y-2">
              <div
                className={`h-4 w-3/4 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div
                className={`h-4 w-1/2 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              />
            </div>
            <div
              className={`h-5 w-20 rounded-full ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
            />
            <div
              className={`h-10 w-24 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = ({ isDarkMode }: SkeletonProps) => (
  <div className="space-y-6 animate-pulse p-2 h-full">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-indigo-50"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-7 w-48 rounded ${isDarkMode ? "bg-indigo-500/20" : "bg-indigo-500/10"}`}
          />
          <div
            className={`h-2 w-64 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div
        className={`h-10 w-64 rounded-xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-gray-100"}`}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`p-5 rounded-3xl border flex items-center gap-4 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <div
            className={`w-12 h-12 rounded-2xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-50"}`}
          />
          <div className="space-y-2 flex-1">
            <div
              className={`h-2.5 w-24 rounded-full ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
            />
            <div
              className={`h-6 w-16 rounded-lg ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
            />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        className={`lg:col-span-2 h-[450px] rounded-3xl border ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
      />
      <div
        className={`h-[450px] rounded-3xl border ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
      <div
        className={`lg:col-span-5 h-[400px] rounded-3xl border ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-gray-50 shadow-sm"}`}
      />
      <div
        className={`lg:col-span-7 h-[400px] rounded-3xl border ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-gray-50 shadow-sm"}`}
      />
    </div>
  </div>
);

export const MedicamentoExternoSkeleton = ({ isDarkMode }: SkeletonProps) => (
  <div className="flex flex-col h-full animate-pulse gap-6 p-2">
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${isDarkMode ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-indigo-50"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-7 w-64 rounded-lg ${isDarkMode ? "bg-indigo-500/20" : "bg-indigo-500/10"}`}
          />
          <div
            className={`h-2 w-56 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div
          className={`h-12 w-80 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
        />
        <div
          className={`h-12 w-40 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
        />
      </div>
    </div>
    <div
      className={`flex-1 border-4 rounded-[2.5rem] overflow-hidden ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100 shadow-sm"}`}
    >
      <div
        className={`h-14 flex items-center px-6 gap-4 ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full flex-1 ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        ))}
      </div>
      <div className="">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 flex items-center px-6 gap-4">
            <div
              className={`w-10 h-6 rounded-lg ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
            />
            <div className="flex-1 flex gap-3 items-center">
              <div
                className={`w-10 h-10 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
              />
              <div className="space-y-2">
                <div
                  className={`h-4 w-32 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
                />
                <div
                  className={`h-2 w-20 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
                />
              </div>
            </div>
            <div
              className={`h-4 w-32 rounded flex-1 ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
            />
            <div
              className={`h-4 w-48 rounded flex-1 ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
            />
            <div className="flex gap-2 justify-center flex-1">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className={`w-10 h-10 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DescargoSkeleton = ({ isDarkMode }: SkeletonProps) => (
  <div className="h-full flex flex-col animate-pulse gap-6 p-2">
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${isDarkMode ? "bg-sky-500/10 border border-sky-500/20" : "bg-sky-50"}`}
        />
        <div className="space-y-2">
          <div
            className={`h-7 w-72 rounded-lg ${isDarkMode ? "bg-sky-500/20" : "bg-sky-500/10"}`}
          />
          <div
            className={`h-2 w-48 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div
          className={`h-12 w-80 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
        />
        <div
          className={`h-12 w-40 rounded-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
        />
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`rounded-[2rem] border p-8 flex justify-between items-center ${isDarkMode ? "bg-zinc-950/50 border-zinc-900" : "bg-white border-gray-100 shadow-sm"}`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-14 h-14 rounded-2xl ${isDarkMode ? "bg-zinc-800" : "bg-sky-500/10"}`}
            />
            <div className="space-y-3">
              <div
                className={`h-6 w-72 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"}`}
              />
              <div className="flex gap-4">
                <div
                  className={`h-3 w-20 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
                />
                <div
                  className={`h-3 w-32 rounded ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
                />
              </div>
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-xl ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
          />
        </div>
      ))}
    </div>
  </div>
);
