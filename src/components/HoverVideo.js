'use client';

export default function HoverVideo({ src, ...props }) {
  return (
    <video
      {...props}
      onMouseEnter={(e) => {
        e.target.muted = true;
        e.target.play();
      }}
      onMouseLeave={(e) => {
        e.target.muted = false;
        e.target.currentTime = 0;
        e.target.pause();
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
