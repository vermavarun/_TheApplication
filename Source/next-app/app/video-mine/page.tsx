"use client";
import { useRef, useEffect, useState } from "react";
import TopNav from "../components/topnav";
import toast, { Toaster } from "react-hot-toast";
import "./video.css";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.1);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    let totalSize = 0;
    let isCancelled = false;
    let mediaSource: MediaSource | null = null;
    let sourceBuffer: SourceBuffer | null = null;
    let videoEl: HTMLVideoElement | null = null;
    setIsLoading(true);

    async function startStreaming() {
      // Step 1: Get total size
      const resp = await fetch("/api/video/stream", { method: "GET", headers: { Range: "bytes=0-1" } });
      if (!resp.ok) throw new Error("Failed to get video size");
      const contentRange = resp.headers.get("Content-Range");
      if (!contentRange) throw new Error("No Content-Range header");
      const match = contentRange.match(/\/(\d+)$/);
      if (!match) throw new Error("Invalid Content-Range header");
      totalSize = parseInt(match[1], 10);

      // Step 2: Setup MediaSource
      mediaSource = new window.MediaSource();
      setVideoUrl(""); // Clear any previous src
      const url = URL.createObjectURL(mediaSource);
      setVideoUrl(url);

      mediaSource.addEventListener("sourceopen", async () => {
        if (!mediaSource) return;
        videoEl = videoRef.current;
        if (!videoEl) return;
  sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401e, mp4a.40.2"');

        let start = 0;
        let fetching = false;

        async function fetchAndAppendChunk() {
          if (isCancelled || !mediaSource || !sourceBuffer) return;
          if (start >= totalSize) {
            if (mediaSource.readyState === "open") mediaSource.endOfStream();
            setIsLoading(false);
            return;
          }
          if (fetching || sourceBuffer.updating) return;
          fetching = true;
          const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
          try {
            const chunkResp = await fetch("/api/video/stream", {
              headers: { Range: `bytes=${start}-${end}` },
            });
            if (!chunkResp.ok) throw new Error(`Failed to fetch chunk: ${start}-${end}`);
            const chunk = await chunkResp.arrayBuffer();
            sourceBuffer.appendBuffer(chunk);
            start = end + 1;
          } catch (err) {
            setError("Failed to load video");
            setIsLoading(false);
            toast.error("Failed to load video. Please try again.");
            return;
          } finally {
            fetching = false;
          }
        }

        sourceBuffer.addEventListener("updateend", fetchAndAppendChunk);
        // Start first chunk
        fetchAndAppendChunk();
      });
    }

    startStreaming().catch((err) => {
      setError("Failed to load video");
      setIsLoading(false);
      toast.error("Failed to load video. Please try again.");
    });

    return () => {
      isCancelled = true;
      if (mediaSource) {
        mediaSource.removeEventListener("sourceopen", () => {});
      }
      if (videoEl) {
        videoEl.src = "";
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  const handleLoadStart = () => {
    console.log("Video loading started");
    setIsLoading(true);
  };

  const handleLoadedMetadata = () => {
    console.log("Video metadata loaded");
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    console.log("Video can start playing");
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    setError("Failed to load video");
    setIsLoading(false);
    toast.error("Failed to load video. Please try again.");
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setBuffered(videoRef.current.buffered);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Disable right-click context menu
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getBufferedPercentage = () => {
    if (!buffered || !duration) return 0;

    let bufferedEnd = 0;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) > bufferedEnd) {
        bufferedEnd = buffered.end(i);
      }
    }
    return (bufferedEnd / duration) * 100;
  };

  if (error) {
    return (
      <main>
        <TopNav />
        <Toaster position="top-right" />
        <div className="video-container">
          <div className="error-message">
            <h2>Error Loading Video</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <TopNav />
      <Toaster position="top-right" />

      <div className="video-container main-content">
        <h1>Video Player - Range Request Streaming</h1>

        <div className="video-wrapper">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner">Loading...</div>
            </div>
          )}

          <video
            ref={videoRef}
            className="video-player"
            src={videoUrl || undefined}
            onLoadStart={handleLoadStart}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onError={handleError}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onContextMenu={handleContextMenu}
            preload="metadata"
            width="800"
            height="450"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
          >
            Your browser does not support the video tag.
          </video>

          <div className="video-controls">
            <div className="control-row">
              <button
                className="play-pause-btn"
                onClick={togglePlayPause}
                disabled={isLoading}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="volume-control">
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              <button
                className="fullscreen-btn"
                onClick={toggleFullscreen}
                disabled={isLoading}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? "⛶" : "⛶"}
              </button>
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="buffered-bar"
                  style={{ width: `${getBufferedPercentage()}%` }}
                />
                <div
                  className="played-bar"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="seek-slider"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="video-info">
          <h3>Video Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Status:</strong> {isLoading ? "Loading..." : "Ready"}
            </div>
            <div className="info-item">
              <strong>Duration:</strong> {formatTime(duration)}
            </div>
            <div className="info-item">
              <strong>Buffered:</strong> {getBufferedPercentage().toFixed(1)}%
            </div>
            <div className="info-item">
              <strong>Current Time:</strong> {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
