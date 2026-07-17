import { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import axios from "axios";

function RecentUploads({ uploads, setUploads, activeUploadId, onSelectUpload, darkMode }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [editUpload, setEditUpload] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const uploadsPerPage = 5;

  const getUploadName = (upload) => {
    return (upload?.filename || upload?.file || "").toString();
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Delete File
  const handleDelete = async (uploadId, e) => {
    e.stopPropagation(); // Prevent row selection trigger
    try {
      await axios.delete(`http://127.0.0.1:8000/uploads/${uploadId}`, getAuthHeader());
      setUploads(uploads.filter((upload) => upload.id !== uploadId));
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file.");
    }
  };

  // Edit File
  const handleEdit = (upload, e) => {
    e.stopPropagation(); // Prevent row selection trigger
    setEditUpload(upload);
    setEditFileName(getUploadName(upload));
  };

  // Save Edited File
  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent row selection trigger
    if (!editUpload) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/uploads/${editUpload.id}`,
        {
          filename: editFileName,
        },
        getAuthHeader()
      );

      const updatedUploads = uploads.map((upload) =>
        upload.id === editUpload.id
          ? {
              ...upload,
              filename: response.data.filename,
              file: response.data.filename,
            }
          : upload
      );

      setUploads(updatedUploads);
      toast.success("Filename updated successfully!");
      setEditUpload(null);
      setEditFileName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update filename.");
    }
  };

  // Filter and Sort Uploads
  const filteredUploads = uploads.filter((upload) =>
    getUploadName(upload).toLowerCase().includes(search.toLowerCase())
  );

  const sortedUploads = [...filteredUploads];

  if (sortBy === "name") {
    sortedUploads.sort((a, b) => getUploadName(a).localeCompare(getUploadName(b)));
  }

  if (sortBy === "size") {
    sortedUploads.sort((a, b) => parseFloat(a.size || 0) - parseFloat(b.size || 0));
  }

  if (sortBy === "status") {
    sortedUploads.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
  }

  if (sortBy === "Newest") {
    sortedUploads.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sortBy === "Oldest") {
    sortedUploads.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Pagination Logic
  const indexOfLastUpload = currentPage * uploadsPerPage;
  const indexOfFirstUpload = indexOfLastUpload - uploadsPerPage;
  const currentUploads = sortedUploads.slice(indexOfFirstUpload, indexOfLastUpload);

  // Export to CSV
  const handleExportCSV = (e) => {
    e.stopPropagation();
    const headers = ["File Name", "Size", "Rows", "Columns", "Date"];
    const rows = uploads.map((upload) => [
      getUploadName(upload),
      upload.size || "",
      upload.rows || 0,
      upload.columns || 0,
      upload.date || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "DataSightAI_Uploads.csv");
  };

  // Export to PDF
  const handleExportPDF = (e) => {
    e.stopPropagation();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("DataSight AI Datasets Inventory", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["File Name", "Size", "Rows", "Columns", "Upload Date"]],
      body: uploads.map((upload) => [
        getUploadName(upload),
        upload.size || "",
        upload.rows || 0,
        upload.columns || 0,
        new Date(upload.date).toLocaleDateString(),
      ]),
    });

    doc.text(`Total Datasets: ${uploads.length}`, 14, doc.lastAutoTable.finalY + 12);
    doc.save("DataSightAI_Inventory.pdf");
  };

  return (
    <div className={`rounded-2xl border shadow-xl p-6 mt-8 ${
      darkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-100 text-slate-800"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Datasets</h2>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Select a row to load the dataset into the active workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 transition cursor-pointer flex items-center gap-1.5"
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 transition cursor-pointer flex items-center gap-1.5"
          >
            📥 Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="🔍 Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            darkMode ? "bg-slate-850 border border-slate-700/60 text-slate-200 placeholder-slate-500" : "bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400"
          }`}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 cursor-pointer ${
            darkMode ? "bg-slate-850 border border-slate-700/60 text-slate-200" : "bg-slate-50 border border-slate-200 text-slate-750"
          }`}
        >
          <option value="default">Sort by...</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="status">Status</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
              darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}>
              <th className="py-3 px-4">Dataset Name</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Dimensions</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUploads.map((upload) => {
              const isSelected = activeUploadId === upload.id;
              return (
                <tr
                  key={upload.id}
                  onClick={() => onSelectUpload(upload)}
                  className={`border-b transition duration-150 cursor-pointer ${
                    darkMode
                      ? `border-slate-800/60 ${isSelected ? "bg-blue-600/10 text-white" : "hover:bg-slate-800/40 text-slate-300"}`
                      : `border-slate-100 ${isSelected ? "bg-blue-50 text-slate-900" : "hover:bg-slate-50 text-slate-650"}`
                  }`}
                >
                  <td className="py-3.5 px-4 font-medium max-w-[200px] truncate">
                    {editUpload === upload ? (
                      <input
                        type="text"
                        value={editFileName}
                        onClick={(e) => e.stopPropagation()} // Prevent row selection
                        onChange={(e) => setEditFileName(e.target.value)}
                        className={`rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          darkMode ? "bg-slate-800 border border-slate-700 text-white" : "bg-white border border-slate-350 text-slate-800"
                        }`}
                      />
                    ) : (
                      getUploadName(upload)
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs">{upload.size}</td>
                  <td className="py-3.5 px-4 text-xs">
                    {upload.rows} R x {upload.columns} C
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-150 text-blue-800">
                      {upload.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUpload(upload);
                        }}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-600/10 hover:bg-slate-600/20 text-blue-500"
                        }`}
                      >
                        {isSelected ? "Active" : "Select"}
                      </button>

                      {editUpload === upload ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded text-xs transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditUpload(null);
                            }}
                            className="bg-slate-500 hover:bg-slate-400 text-white px-2.5 py-1 rounded text-xs transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => handleEdit(upload, e)}
                          className="bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 px-2.5 py-1 rounded text-xs transition cursor-pointer"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(upload.id, e)}
                        className="bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 px-2.5 py-1 rounded text-xs transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {currentUploads.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500 text-xs">
                  No datasets found. Upload a file to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedUploads.length > uploadsPerPage && (
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-800/40">
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
            Page {currentPage} of {Math.ceil(sortedUploads.length / uploadsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(sortedUploads.length / uploadsPerPage), p + 1))}
            disabled={currentPage === Math.ceil(sortedUploads.length / uploadsPerPage)}
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

export default RecentUploads;