"use client";

import { useState } from "react";

const DownloadPage = () => {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async () => {
    setProgress(0);
    setDownloading(true);

    const fileName = "Chhava.mkv"; // Change to your file name
    const chunkSize = 5 * 1024 * 1024; // 5MB
    let downloadedBytes = 0;
    const fileChunks: Blob[] = [];

    // Fetch file metadata to determine total size
    const metadataResponse = await fetch(`/api/download?fileName=${fileName}&metadata=true`);
    const { fileSize } = await metadataResponse.json();

    for (let start = 0; start < fileSize; start += chunkSize) {
      const response = await fetch(`/api/download?fileName=${fileName}&start=${start}&chunkSize=${chunkSize}`);
      if (!response.ok) throw new Error("Chunk download failed");

      const chunk = await response.blob();
      fileChunks.push(chunk);
      downloadedBytes += chunk.size;
      setProgress(Math.round((downloadedBytes / fileSize) * 100));
    }

    // Combine chunks into a single Blob
    const finalBlob = new Blob(fileChunks);
    const url = URL.createObjectURL(finalBlob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloading(false);
  };

  return (
    <div>
      <button onClick={downloadFile} disabled={downloading}>
        {downloading ? "Downloading..." : "Download"}
      </button>
      <progress value={progress} max="100">{progress}%</progress>
      <p>{progress}%</p>
    </div>
  );
};

export default DownloadPage;
