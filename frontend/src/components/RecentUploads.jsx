import { useState } from "react";

function RecentUploads({ uploads, setUploads,darkmode }) {
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editFileName, setEditFileName] = useState("");

  // Delete File
  const handleDelete = (indexToDelete) => {
    const updatedUploads = uploads.filter(
      (_, index) => index !== indexToDelete
    );

    setUploads(updatedUploads);
  };

  // Edit File
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditFileName(uploads[index].file);
  };

  // Save Edited File
  const handleSave = (index) => {
    const updatedUploads = [...uploads];

    updatedUploads[index].file = editFileName;

    setUploads(updatedUploads);

    setEditIndex(null);
    setEditFileName("");
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
          {uploads
            .filter((upload) =>
              upload.file.toLowerCase().includes(search.toLowerCase())
            )
            .map((upload, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editFileName}
                      onChange={(e) => setEditFileName(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    upload.file
                  )}
                </td>

                <td>{upload.size}</td>

                <td>{upload.status}</td>

                <td>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  {editIndex === index ? (
                    <button
                      onClick={() => handleSave(index)}
                      className="bg-green-600 text-white px-3 py-1 rounded ml-2 hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
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
    </div>
  );
}

export default RecentUploads;