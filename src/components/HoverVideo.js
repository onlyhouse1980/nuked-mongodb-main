'use client';

export default function HoverVideo({ src, ...props }) {
  return (
    <video
      {...props}
      crossOrigin="anonymous"
      onMouseEnter={(e) => {
        e.target.muted = true;
        const playPromise = e.target.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay was prevented:", error);
          });
        }
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
