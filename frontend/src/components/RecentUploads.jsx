import {useState } from "react";
function RecentUploads() {
    const[search,setSearch] = useState(""); 

  const uploads = [
    {
      file: "sales.csv",
      size: "2 MB",
      status: "Uploaded",
    },
    {
      file: "customers.xlsx",
      size: "5 MB",
      status: "Uploaded",
    },
    {
      file: "profit.csv",
      size: "1 MB",
      status: "Pending",
    },
  ];

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

            <th className="text-left py-2">File Name</th>
            <th className="text-left py-2">Size</th>
            <th className="text-left py-2">Status</th>

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
          {upload.file}
        </td>

        <td>
          {upload.size}
        </td>

        <td>
          {upload.status}
        </td>

      </tr>

    ))}



        </tbody>

      </table>

    </div>
  );
}

export default RecentUploads;