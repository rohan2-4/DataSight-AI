function CsvPreview({ csvData }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        CSV Data Preview
      </h2>

      {csvData.length === 0 ? (
        <p className="text-gray-500">
          No CSV uploaded yet.
        </p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((header) => (
                <th
                  key={header}
                  className="border p-2 bg-gray-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {csvData.slice(0, 10).map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td
                    key={i}
                    className="border p-2"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CsvPreview;