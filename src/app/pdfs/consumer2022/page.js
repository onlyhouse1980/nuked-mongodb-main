export default function Page() {
  const embedURL =
    "https://drive.google.com/file/d/1jJbNsfyhuwLOaFYmoqll0tFeCnsRnOWk/preview";
  return (
    <div className="container">
      <h5>Consumer Confidence 2021</h5>
      <iframe
        src={embedURL}
        width="100%"
        height="500"
      ></iframe>
    </div>
  );
};