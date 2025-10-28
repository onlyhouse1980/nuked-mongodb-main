export default function Page() {
  const embedURL = "https://drive.google.com/file/d/14AbNqAL7drm7Ucyzz1ReiNst_E6Jy5Qo/preview";
  return (
    <div className="container">
      <h5>Consumer Confidence 2020</h5>
      <iframe
        src={embedURL}
        width="100%"
        height="500"
      ></iframe>
    </div>
  );
};

