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
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      try {
        const formData = new FormData();
        formData.append("csv_file", file);

        const response = await fetch("http://localhost:5000/save_file/", {
          method: "POST",
          body: formData,
          // No need to manually set Content-Type header for FormData
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
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
        </section>
      )}

      {file && (
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
