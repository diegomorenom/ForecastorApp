import React, { useState } from "react";
import "./SingleFileUploader.css"; // Import the CSS file

const SingleFileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });

        const data = await result.json();

        console.log(data);
        setStatus("success");
      } catch (error) {
        console.error(error);
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
