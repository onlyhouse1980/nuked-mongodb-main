export default function Page() {
  const embedURL = 
    "https://drive.google.com/file/d/1wMxlrlq1APB6GuutUMPM1XdjhfEkPxeK/preview";
  return (
    <div className="container">
      <iframe
        src={embedURL}
        width="100%"
        height="1000px"
      ></iframe>
    </div>
  );
};

