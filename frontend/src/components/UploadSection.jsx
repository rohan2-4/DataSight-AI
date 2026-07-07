import { useState,useRef } from "react";
import Papa from "papaparse";

function UploadSection({ uploads, setUploads,csvData, setCsvData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    const newUpload = {
    file: selectedFile.name,
    size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
    status: "Uploaded",
  };

  setUploads((prevUploads) => [...prevUploads, newUpload]);
  Papa.parse(selectedFile, {
  header: true,
  skipEmptyLines: true,

  complete: function (results) {
    console.log(results.data);

    setCsvData(results.data);
  },
});

  setSelectedFile(null);
   fileInputRef.current.value = "";
    alert(`File "${selectedFile.name}" is ready to upload.`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

      <h2 className="text-2xl font-bold mb-4">
        Upload Dataset
      </h2>

      <div className="flex gap-4 items-center">

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>

      </div>

      {selectedFile && (
        <p className="mt-4 text-green-600">
          Selected File: {selectedFile.name}
        </p>
      )}

    </div>
  );
}

export default UploadSection;