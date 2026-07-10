function AIInsights({ uploads, csvData,darkMode }) {
  const cardClass = darkMode
  ? "bg-gray-700 p-4 rounded-lg shadow"
  : "bg-blue-100 p-4 rounded-lg shadow";
  
    const totalColumns =
  csvData.length > 0
    ? Object.keys(csvData[0]).length
    : 0;
    const numericColumns =
        csvData.length > 0
        ? Object.keys(csvData[0]).filter((column) =>
        csvData.every((row) => !isNaN(row[column]) && row[column] !== "")
      ).length
    : 0;

const textColumns = totalColumns - numericColumns;
    const totalStorage = uploads.reduce((total, upload) => {
     return total + parseFloat(upload.size);
}, 0);
              

    const averageStorage =
     uploads.length > 0
        ? totalStorage / uploads.length
        : 0;
    const largestFile =
  uploads.length > 0
    ? uploads.reduce((largest, current) =>
        parseFloat(current.size) > parseFloat(largest.size)
          ? current
          : largest
      )
    : null;
    const lastUploaded =
  uploads.length > 0
    ? uploads.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date)
          ? current
          : latest
      )
    : null;
    const missingValues = csvData.reduce((count, row) => {
  Object.values(row).forEach((value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      count++;
    }
  });

  return count;
}, 0);
const duplicateRows = csvData.length - new Set(
  csvData.map((row) => JSON.stringify(row))
).size;
const totalCells = csvData.length * totalColumns;

const dataQuality =
  totalCells > 0
    ? (
        ((totalCells - missingValues - duplicateRows) /
          totalCells) *
        100
      ).toFixed(2)
    : 100;
const aiSummary = `
Your dataset contains ${csvData.length} rows and ${totalColumns} columns.
Data quality is ${dataQuality}% with ${duplicateRows} duplicate rows and ${missingValues} missing values.
The largest uploaded file is ${
  largestFile ? largestFile.file : "N/A"
}.
`;
const csvFiles = uploads.filter((upload) =>
  upload.file.toLowerCase().endsWith(".csv")
).length;

const excelFiles = uploads.filter((upload) =>
  upload.file.toLowerCase().endsWith(".xlsx")
).length;

  return (
    <div className={
      darkMode
      ? "bg-gray-800 text-white rounded-xl shadow-lg p-6 mt-8"
      : "bg-white rounded-xl shadow-lg p-6 mt-8"
       }>
      <h2 className="text-2xl font-bold mb-4">
        🤖 AI Insights
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className={cardClass}>
          <h3>Total Files</h3>

          <p className="text-2xl font-bold">
           {uploads.length}
        </p>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h3>Total CSV Rows</h3>
          <p className="text-2xl font-bold">
            {csvData.length}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
            <h3>Total Columns</h3>
            <p className="text-2xl font-bold">
              {totalColumns}
            </p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
            <h3>Total Storage Used</h3>
            <p className="text-2xl font-bold">
                 {totalStorage.toFixed(2)} KB
            </p>
        </div>
        <div className="bg-cyan-100 p-4 rounded-lg">
        <h3>Average File Size</h3>
        <p className="text-2xl font-bold">
            {averageStorage.toFixed(2)} KB
        </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
         <h3>Largest File</h3>

        <p className="text-xl font-bold">
             {largestFile
                ? `${largestFile.file} (${largestFile.size})`
                : "No files"}
        </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
        <h3>Last Uploaded</h3>

        <p className="text-xl font-bold">
            {lastUploaded
            ? lastUploaded.file
            : "No uploads"}
        </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
            ❌ Missing Values
        </h3>

        <p className="text-2xl font-bold">
    {missingValues}
        </p>
        </div>
        <div className="bg-pink-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
            🔁 Duplicate Rows
        </h3>

        <p className="text-2xl font-bold">
            {duplicateRows}
        </p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
        🔢 Numeric Columns
        </h3>

        <p className="text-2xl font-bold">
        {numericColumns}
        </p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
         📝 Text Columns
        </h3>

        <p className="text-2xl font-bold">
        {textColumns}
        </p>
        </div>
        <div className="bg-blue-200 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
            📄 CSV Files
        </h3>

        <p className="text-2xl font-bold">
            {csvFiles}
        </p>
        </div>
        <div className="bg-green-200 p-4 rounded-lg shadow">
  <h3 className="text-lg font-semibold">
            📊 Excel Files
        </h3>

        <p className="text-2xl font-bold">
            {excelFiles}
        </p>
        </div>
        <div className="bg-indigo-100 p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold mb-2">
        🤖 AI Summary
        </h3>

        <p  className={
          darkMode
            ? "text-gray-300"
            : "text-gray-700"
          }>
            {aiSummary}
        </p>
        </div>
      </div>

    </div>
  );
}

export default AIInsights;