export default function Page() {
  const embedURL =
    "/FAQ.pdf";
  return (
    <div className="container">
      <h5>FAQS</h5>
      <iframe src={embedURL} width="100%" height="500" />
    </div>
  );
}