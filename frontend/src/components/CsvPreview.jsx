import { useState, useEffect } from "react";

function CsvPreview({ activeData, darkMode }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const data = activeData?.data || [];
  const columns = activeData?.column_names || [];

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeData]);

  if (!activeData || data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 mt-6 shadow-xl">
        <p className="text-lg">No active dataset loaded.</p>
        <p className="text-sm mt-1 text-slate-500">Select an uploaded dataset to view its contents in a spreadsheet grid.</p>
      </div>
    );
  }

  // Localized search filter
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination bounds
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className={`rounded-2xl border shadow-xl p-6 mt-8 ${
      darkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-100 text-slate-850"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dataset Explorer</h2>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Previewing first 100 rows of <span className="text-blue-400 font-semibold">{activeData.filename}</span>
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search in grid..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64 ${
            darkMode ? "bg-slate-850 border border-slate-700/60 text-slate-200 placeholder-slate-500" : "bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400"
          }`}
        />
      </div>

      <div className="overflow-x-auto border border-slate-800/60 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-bold ${
              darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
            }`}>
              <th className="py-2.5 px-3 w-12 text-center border-r border-slate-800/40">#</th>
              {columns.map((col) => (
                <th key={col} className="py-2.5 px-3 font-semibold border-r border-slate-800/40 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={index}
                className={`border-b transition duration-100 last:border-b-0 ${
                  darkMode ? "border-slate-800/50 hover:bg-slate-850/30 text-slate-300" : "border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <td className={`py-2 px-3 text-center font-bold border-r border-slate-800/40 ${
                  darkMode ? "bg-slate-950/20 text-slate-500" : "bg-slate-50 text-slate-400"
                }`}>
                  {indexOfFirstRow + index + 1}
                </td>
                {columns.map((col, idx) => (
                  <td key={idx} className="py-2 px-3 border-r border-slate-800/40 last:border-r-0 max-w-[200px] truncate" title={String(row[col] || "")}>
                    {row[col] !== null ? String(row[col]) : <span className="text-slate-500 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}

            {currentRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-slate-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode ? "bg-slate-850 hover:bg-slate-800 text-slate-300" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">
            Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, totalRows)} of {totalRows} records
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode ? "bg-slate-850 hover:bg-slate-800 text-slate-300" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CsvPreview;