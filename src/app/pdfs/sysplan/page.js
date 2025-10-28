export default function Page() {
  const embedURL='https://drive.google.com/file/d/17lD6BK833c90-iDJ4hFkgL7wuZV1NtPN/preview';
  return (
   <div className='container'>
    <h5>System Plan</h5>
    <iframe src={embedURL} width="100%" height="500"></iframe>
  </div>

  );
}