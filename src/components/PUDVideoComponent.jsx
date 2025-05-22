export default async function VideoComponent() {
  const src = await getVideoSrc()
 
  return <iframe src={"https://drive.google.com/file/d/1Op6BCXirdL5YD0YOXRKE890U7uzvESOf/preview"} allowFullScreen />
}
