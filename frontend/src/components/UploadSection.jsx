import { useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function UploadSection({ setUploads, onSelectUpload, darkMode }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };

  const uploadFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/uploads", formData, getAuthHeader());

      // Prepend to uploads list
      setUploads((prev) => [response.data, ...prev]);

      // Automatically select the newly uploaded file
      onSelectUpload(response.data);

      toast.success(`Dataset "${file.name}" uploaded and loaded successfully!`);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail || "Failed to upload file.";
      toast.error(detail);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`rounded-2xl border shadow-xl p-6 mb-8 ${
      darkMode ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-white border-slate-100 text-slate-800"
    }`}>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Upload Dataset</h2>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition duration-200 flex flex-col items-center justify-center min-h-[160px] ${
          dragActive
            ? "border-blue-500 bg-blue-500/5"
            : darkMode
            ? "border-slate-800 hover:border-slate-700 hover:bg-slate-850/40"
            : "border-slate-200 hover:border-slate-350 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-400">Processing and parsing dataset...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">📤</span>
            <p className="text-sm font-semibold mt-2">
              Drag & drop your file here, or <span className="text-blue-500">browse</span>
            </p>
            <p className="text-xs text-slate-500">Supports CSV, XLS, and XLSX up to 50MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadSection;