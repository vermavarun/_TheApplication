"use client";
import { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch("/api/video-stream");
        if (!response.ok) throw new Error("Failed to fetch video");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoUrl(blobUrl);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl); // Cleanup blob URL
    };
  }, []);

  return (
    <div>      <h2>Video Streaming</h2>
      {videoUrl ? (
        <video ref={videoRef} controls width="800" height="450" controlsList="nodownload" onContextMenu={e => e.preventDefault()}>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
