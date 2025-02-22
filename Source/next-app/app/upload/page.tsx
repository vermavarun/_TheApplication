"use client";
import { useState } from "react";

const UploadPage = () => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setProgress(0);
    setUploading(true);

    const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
    const totalBytes = selectedFile.size;
    let uploadedBytes = 0;

    for (let start = 0; start < totalBytes; start += chunkSize) {
      const chunk = selectedFile.slice(start, start + chunkSize);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("chunkStart", start.toString()); // Track chunk position
      formData.append("fileName", selectedFile.name); // Use same file name

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Chunk upload failed");
        }

        uploadedBytes += chunk.size;
        setProgress(Math.round((uploadedBytes / totalBytes) * 100));
      } catch (error) {
        console.error("Upload error:", error);
        alert("File upload failed.");
        setUploading(false);
        return;
      }
    }

    setProgress(100);
    setUploading(false);
    alert("File uploaded successfully!");
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <progress value={progress} max="100">{progress}%</progress>
      <p>{progress}%</p>
    </div>
  );
};

export default UploadPage;
