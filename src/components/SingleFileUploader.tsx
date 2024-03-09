import React, { useState } from "react";
import "./SingleFileUploader.css"; // Import the CSS file

interface SingleFileUploaderProps {
  onSuccess: () => void;
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedPredictionColumn, setSelectedPredictionColumn] = useState<string>('');
  const [selectedDateColumn, setSelectedDateColumn] = useState<string>('');

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        console.error("File size exceeds maximum limit");
        // Optionally, display an error message to the user
        return;
      }
      setStatus("initial");
      setFile(selectedFile);

      // Parse the CSV file to extract column names
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const content = event.target.result.toString();
          const rows = content.split('\n');
          if (rows.length > 0) {
            const headers = rows[0].split(',');
            setColumns(headers);
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      try {
        const formData = new FormData();
        formData.append("metadata_str", JSON.stringify({ prediction_column: selectedPredictionColumn, date_column: selectedDateColumn }));
        formData.append("csv_file", file);

        console.log("File:", file);
        console.log("metadata_str:", JSON.stringify({ prediction_column: selectedPredictionColumn, date_column: selectedDateColumn }));
        console.log("Request body:", formData);

        const response = await fetch("http://localhost:5000/save_file/", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
        setStatus("success");
        onSuccess(); // Call the onSuccess callback
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus("fail");
      }
    }
  };

  return (
    <div className="file-uploader-container">
      <label htmlFor="file" className="file-label">
        Choose a file
      </label>
      <input
        id="file"
        type="file"
        className="file-input"
        onChange={handleFileChange}
      />

      {file && (
        <section className="file-details">
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>

          <div>
            <label htmlFor="date-column">Date Column:</label>
            <select id="date-column" value={selectedDateColumn} onChange={(e) => setSelectedDateColumn(e.target.value)}>
              <option value="">Select column</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prediction-column">Prediction Column:</label>
            <select id="prediction-column" value={selectedPredictionColumn} onChange={(e) => setSelectedPredictionColumn(e.target.value)}>
              <option value="">Select column</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>

        </section>
      )}

      {file && selectedPredictionColumn && selectedDateColumn && (
        <button onClick={handleUpload} className="submit-button">
          Upload a file
        </button>
      )}

      <Result status={status} />
    </div>
  );
};

const Result = ({ status }: { status: string }) => {
  if (status === "success") {
    return <p className="result">✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p className="result">❌ File upload failed!</p>;
  } else if (status === "uploading") {
    return <p className="result">⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default SingleFileUploader;
