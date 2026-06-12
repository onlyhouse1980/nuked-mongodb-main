// src/app/video/page.tsx (Server Component)
import { getCldImageUrl } from 'next-cloudinary';


export default function ServerVideoPage() {
  // Generates the streaming video source URL
  const videoUrl = getCldImageUrl({
    src: 'OBCG_2018__4th_July_Parade_p8kgjw_kcmsvd',
    width: 1920,
    height: 1080,
    crop: 'fill',
    assetType: 'video', // <-- Tells Cloudinary this is a video asset
    format: 'mp4',
  });

  // Generates a thumbnail image from the video
  const posterUrl = getCldImageUrl({
    src: 'OBCG_2018__4th_July_Parade_p8kgjw_kcmsvd',
    assetType: 'video',
    format: 'jpg',
  });

  return (
    <video
      src={videoUrl}
      poster={posterUrl}
      controls
      preload="metadata"
      className="w-full max-w-3xl rounded-lg"
    />
  );
}
