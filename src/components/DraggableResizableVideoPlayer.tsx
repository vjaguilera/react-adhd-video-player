import React, { useState, useRef, useEffect, useCallback } from 'react';
import VideoPlayer from './VideoPlayer'; // Assuming VideoPlayer component is imported

type DraggableResizableVideoPlayerProps = {
  videos?: string[];  // Array of video URLs
  initialWidth?: number; // Initial width of the video player
  initialHeight?: number; // Initial height of the video player
  muted?: boolean; // Mute state for the video player
  showControls?: boolean; // Whether to show controls or not
};

const DraggableResizableVideoPlayer: React.FC<DraggableResizableVideoPlayerProps> = ({
  videos = ["https://www.youtube.com/watch?v=_-2ZUciZgls&ab_channel=Orbital-NoCopyrightGameplay"],
  initialWidth = 640,
  initialHeight = 360,
  muted = true,
  showControls = true,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [x, setX] = useState(10); // Initial horizontal position (top-left corner)
  const [y, setY] = useState(10); // Initial vertical position (top-left corner)
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);

  // For dragging
  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) {
      setX(e.clientX - videoRef.current!.offsetWidth / 2);
      setY(e.clientY - videoRef.current!.offsetHeight / 2);
    }

    // Resize logic
    if (resizing) {
      setWidth(e.clientX - videoRef.current!.offsetLeft);
      setHeight(e.clientY - videoRef.current!.offsetTop);
    }
  }, [dragging, resizing]);

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]); // Now we include handleMouseMove in the dependency array


  return (
    <div
      ref={videoRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        cursor: dragging ? 'move' : 'pointer',  // Change to 'move' when dragging
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 1000,  // Ensure it's on top of the rest of the content
        transition: 'top 0.2s ease, left 0.2s ease',  // Smooth animation for dragging
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Set the iframe behind the video player controls
        }}
      >
        <VideoPlayer
          videos={videos}
          width={width}
          height={height}
          muted={muted}
          showControls={showControls}
        />
      </div>
      
      {/* Resize handle at the bottom right corner */}
      <div
        ref={resizeRef}
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '16px',
          height: '16px',
          backgroundColor: 'gray',
          cursor: 'se-resize',  // Resize cursor
        }}
      />
    </div>
  );
};

export default DraggableResizableVideoPlayer;