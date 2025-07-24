import React, { useState } from 'react';

const CSVUpload = ({ portfolioId }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:5000/api/upload/${portfolioId}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("Upload successful!");
      } else {
        const data = await res.json();
        setStatus(`Upload failed: ${data.error}`);
      }
    } catch (err) {
      setStatus("Network error.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="text-lg font-semibold mb-2">Upload Transactions (CSV)</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};

export default CSVUpload;
