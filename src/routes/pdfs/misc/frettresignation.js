'use client';

import React, { useState } from "react";
export const App = () => {
  const [embedURL] = useState(
    
  "https://drive.google.com/file/d/1mEuTMNOs_fQoFJquYRxmOOpmJd_SvAPw/view?usp=sharing"
  );
  return (
    <div className="container">
      <h5>4.15.26 OBCG President Resignation Ltr.</h5>
      <iframe src={embedURL} width="100%" height="500"></iframe>
    </div>
  );
};

export default App;
