import { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import axios from "axios";

function RecentUploads({ uploads, setUploads,darkmode }) {
  const [search, setSearch] = useState("");
  const [sortBy,setSortBy] = useState("default")
  const [editUpload, setEditUpload] = useState(null);
  const [editFileName, setEditFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const uploadsPerPage = 5;

  const getUploadName = (upload) => {
    return (upload?.filename || upload?.file || "").toString();
  };

  // Delete File
 const handleDelete = async (uploadId) => {
  try {
    await axios.delete(
      `http://127.0.0.1:8000/uploads/${uploadId}`
    );

    setUploads(
      uploads.filter((upload) => upload.id !== uploadId)
    );

    toast.success("File deleted successfully!");

  } catch (error) {
    console.error(error);
    toast.error("Failed to delete file.");
  }
};

  // Edit File
  const handleEdit = (upload) => {
    setEditUpload(upload);
    setEditFileName(getUploadName(upload));
  };

  // Save Edited File
const handleSave = async () => {
  if (!editUpload) return;

  try {
    await axios.put(
      `http://127.0.0.1:8000/uploads/${editUpload.id}`,
      {
        filename: editFileName,
      }
    );

    const updatedUploads = uploads.map((upload) =>
      upload.id === editUpload.id
        ? {
            ...upload,
            filename: editFileName,
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
  sortedUploads.sort((a, b) =>
    getUploadName(a).localeCompare(getUploadName(b))
  );
} 

if (sortBy === "size") {
  sortedUploads.sort(
    (a, b) => parseFloat(a.size) - parseFloat(b.size)
  );
}

if (sortBy === "status") {
  sortedUploads.sort((a, b) =>
    (a.status || "").localeCompare(b.status || "")
  );
}
if (sortBy === "Newest") {
  sortedUploads.sort((a, b) => new Date(b.date) - new Date(a.date));
}
if (sortBy === "Oldest") {
  sortedUploads.sort((a, b) => new Date(a.date) - new Date(b.date));
}
// Pagination Logic
const indexOfLastUpload = currentPage * uploadsPerPage;

const indexOfFirstUpload =
  indexOfLastUpload - uploadsPerPage;

const currentUploads = sortedUploads.slice(
  indexOfFirstUpload,
  indexOfLastUpload
);
// Export to CSV 
const handleExportCSV = () => {
  const headers = ["File Name", "Size", "Status"];

  const rows = uploads.map((upload) => [
    getUploadName(upload),
    upload.size || "",
    upload.status || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "uploads.csv");
};
// Export to PDF
const handleExportPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("DataSight AI Report", 14, 20);

  // Subtitle
  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    30
  );

  // Table
  autoTable(doc, {
    startY: 40,

    head: [["File Name", "Size", "Status"]],

    body: uploads.map((upload) => [
      getUploadName(upload),
      upload.size || "",
      upload.status || "",
    ]),
  });

  // Total uploads
  doc.text(
    `Total Uploads: ${uploads.length}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  // Save PDF
  doc.save("DataSightAI_Report.pdf");
};

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Recent Uploads
      </h2>

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />
      <select
        value ={sortBy}
        onChange = {(e) => setSortBy(e.target.value)}
      >
        <option value="default">Sort by...</option>
        <option value="name">Name</option>
        <option value="size">Size</option>
        <option value="status">Status</option>
        <option value="Newest">Newest</option>
        <option value="Oldest">Oldest</option>
      </select>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">File Name</th>
            <th className="py-2">Size</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentUploads.map((upload, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  {editUpload === upload ? (
                    <input
                      type="text"
                      value={editFileName}
                      onChange={(e) => setEditFileName(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    getUploadName(upload)
                  )}
                </td>

                <td>{upload.size}</td>

                <td>{upload.status}</td>

                <td>
                  <button
                    onClick={() => handleDelete(upload.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  {editUpload === upload ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-3 py-1 rounded ml-2 hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(upload)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded ml-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
  >
    Previous
  </button>

  <span>
    Page {currentPage}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={
      currentPage ===
      Math.ceil(sortedUploads.length / uploadsPerPage)
    }
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
  >
    Next
  </button>
  <div className="flex justify-end mb-4">
  <button
    onClick={handleExportCSV}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    📥 Export CSV
  </button>
  <button 
    onClick={handleExportPDF}
    className="bg-red-600 text-white px-4 py-2 rounded ml-2 hover:bg-red-700"
  >
    📥 Export PDF
  </button>
</div>

</div>
    </div>
  );
}

export default RecentUploads;