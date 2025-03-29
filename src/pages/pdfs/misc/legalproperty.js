import React, { useState } from "react";
export const App = () => {
  const [embedURL] = useState(
    "https://drive.google.com/file/d/1nVmJt0EDfM0nJDlp3o-ELQpEw2W6y0QS/preview"
  );
  return (
    <div className="container">
      <h5>Legal Property</h5>
      <iframe src={embedURL} width="100%" height="500"></iframe>
    </div>
  );
};

export default App;
