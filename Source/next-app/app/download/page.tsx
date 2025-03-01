"use client";

import { useState } from "react";

const DownloadPage = () => {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async () => {
    setProgress(0);
    setDownloading(true);

    const fileName = "file.mp4"; // Replace with your file name
    const chunkSize = 5 * 1024 * 1024; // 5MB
    let downloadedBytes = 0;

    // Fetch file metadata (size)
    const metadataResponse = await fetch(`/api/download?fileName=${fileName}&metadata=true`);
    const { fileSize } = await metadataResponse.json();

    // ✅ Ask user for save location
    let writableStream;
    let writer;
    if ("showSaveFilePicker" in window) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: "All Files", accept: { "*/*": [] } }],
      });
      writableStream = await fileHandle.createWritable();
      writer = writableStream.getWriter(); // ✅ Open writer only once
    }

    // ✅ Download in chunks
    const fileChunks: Blob[] = [];
    for (let start = 0; start < fileSize; start += chunkSize) {
      const response = await fetch(`/api/download?fileName=${fileName}&start=${start}&chunkSize=${chunkSize}`);
      if (!response.ok) throw new Error("Chunk download failed");

      const chunk = await response.blob();
      fileChunks.push(chunk);
      downloadedBytes += chunk.size;
      setProgress(Math.round((downloadedBytes / fileSize) * 100));

      // ✅ Write to file directly if writable stream exists
      if (writer) {
        const arrayBuffer = await chunk.arrayBuffer();
        await writer.write(new Uint8Array(arrayBuffer));
      }
    }

    // ✅ Close writer after all chunks are written
    if (writer) await writer.close();

    // ✅ Fallback: If file picker is unavailable, create a downloadable blob
    if (!writableStream) {
      const finalBlob = new Blob(fileChunks);
      const url = URL.createObjectURL(finalBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

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
