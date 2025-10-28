export default function Page() {
  const embedURL = "https://drive.google.com/file/d/1C5qGn2uNg4T6pxUdgwVobAlTngwSJa-N/preview";
  return (
    <div className="container">
      <h5>Consumer Confidence 2022</h5>
      <iframe src={embedURL} width="100%" height="500" />
    </div>
  );
}