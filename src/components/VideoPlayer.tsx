import React, { useState, useEffect } from 'react';

type VideoPlayerProps = {
  videos?: string[];  // Optional: Array of YouTube or Vimeo URLs
  width?: number;     // Optional: Width of the video player, defaults to 640
  height?: number;
  muted?: boolean;    // Optional: Mute state for the player, defaults to true
  showControls?: boolean; // Optional: Show controls, defaults to true
};

const defaultVideos = [
  "https://www.youtube.com/watch?v=_-2ZUciZgls&ab_channel=Orbital-NoCopyrightGameplay",  // Example YouTube video
  "https://vimeo.com/822195781",  // Example Vimeo video
  "https://vimeo.com/894215300",  // New Vimeo video
  "https://player.vimeo.com/video/822195781?h=1c1797085e"  // Another Vimeo video with iframe format
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos = defaultVideos, width = 640, height = 360, muted = true, showControls = true }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    const videoUrl = videos[currentVideoIndex];
    let iframeSrc = '';

    if (videoUrl.includes("youtube.com")) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}${showControls ? '&controls=1' : '&controls=0'}`;
    } else if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("/")[4];  // Extract the video ID from the URL
      iframeSrc = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=${muted ? 1 : 0}${showControls ? '&controls=1' : '&controls=0'}`;
    }

    setIframeSrc(iframeSrc);
  }, [currentVideoIndex, videos, muted, showControls]);

  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
      <iframe
        src={iframeSrc}
        width={width}
        height={height}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Video Player"
      />
      <button onClick={playNextVideo} style={{ marginTop: '1em', padding: '0.5em', borderRadius: '10px' }}>
        Next Video
      </button>
    </div>
  );
};

export default VideoPlayer;