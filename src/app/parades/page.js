import styles from '../../styles/Whales.module.css'
import Link from 'next/link'
import HoverVideo from '../../components/HoverVideo';



const media_urls = [
  {
    id: 1,
    title: '2018 First Parade',
    url: 'parades/parade1',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/q_auto,vc_auto/v1657634720/obcg/OBCG_2018__4th_July_Parade_p8kgjw.mp4#t=0.001',
  },
  {
    id: 2,
    title: '2019 Parade',
    url: 'parades/parade2',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/v1666014062/obcg/favicon_lfowpy.mp4#t=0.001',
  },
  {
    id: 3,
    title: '2020 Parade',
    url: 'parades/parade3',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/v1668240698/obcg/My_video_qngaun.mp4#t=0.001',
  },
  {
    id: 4,
    title: '2021 Parade',
    url: 'parades/parade4',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/v1667839970/obcg/2021_Parade_duelvg.mp4#t=0.001',
  },
  {
    id: 5,
    title: '2022 Parade',
    url: 'parades/parade5',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/v1682981538/obcg_4th_1_fhgyie.mp4#t=0.001',
  },
  {
    id: 6,
    title: '2023 Parade',
    url: 'parades/parade6',
    video_url:
      'https://res.cloudinary.com/dfnaxhqqq/video/upload/v1709113418/2023_Parade_fqpwlo.mp4#t=0.001',
  },
  {
    id: 7,
    title: '2024 Parade',
    url: 'parades/parade7',
    video_url:
      'https://res.cloudinary.com/dqxg7ccdf/video/upload/v1720796591/Orchard_Beach_July_4_parade_2024_sbfa5a.mp4#t=0.001',
  },
  {
    id: 8,
    title: '2025 Parade',
    url: 'parades/parade8',
    video_url:
      'https://res.cloudinary.com/dqxg7ccdf/video/upload/v1772472735/PXL_20250704_190947008.TS_lnddkd.mp4#t=0.001',
  },
]

const getOptimizedPoster = (videoUrl) => {
  // Force .webp directly for modern image format and use w_310 to reduce dimensions
  let url = videoUrl.split('#')[0].replace('.mp4', '.webp');
  if (url.includes('/upload/q_auto,vc_auto/')) {
    return url.replace('/upload/q_auto,vc_auto/', '/upload/c_scale,w_310,q_auto:eco/');
  } else {
    return url.replace('/upload/', '/upload/c_scale,w_310,q_auto:eco/');
  }
};
const Parades = () => {
  return (
    <>
      <link rel="preload" as="image" href={getOptimizedPoster(media_urls[0].video_url)} fetchPriority="high" crossOrigin="anonymous" />
      <div className={styles.headline}>
        <h1 className='text-center'>OBCG Annual 4th of July Parade</h1>
      </div>
      <div className='container'>
        <div className='row'>
          {media_urls.map((media) => (
            <div key={media.id} className='col-lg-4 col-sm-6 mb-4'>
              <Link href={media.url}>
                <div className='card h-100 bg-indigo-500'>
                  <div className={styles.cardBody}>
                    <h4 className={styles.cardTitle}> {media.title}</h4>
                    <HoverVideo
                      key={media.id}
                      preload="metadata"
                      poster={getOptimizedPoster(media.video_url)}
                      fetchPriority={media.id === 1 ? 'high' : 'auto'}
                      width='100%'
                      controls
                      style={{ paddingBottom: '10px', aspectRatio: '16/9', objectFit: 'cover', backgroundColor: '#000' }}
                      src={media.video_url}
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )

}

export default Parades;
