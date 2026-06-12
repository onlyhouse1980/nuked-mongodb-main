export default function franchisepermit() {
  const embedURL =
    "/franchisepermit.pdf";
  return (
    <div className="container">
      <h5>Mason County Franchise Permit</h5>
      <iframe src={embedURL} width="100%" height="500" />
    </div>
  );
}