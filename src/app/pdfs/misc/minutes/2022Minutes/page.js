import React from "react";
import styles from "@/routes/pdfs/misc/minutes/2022Minutes.module.css";

export const App = () => {
  const embedURL = 
    "https://drive.google.com/file/d/1qXVAsV-Rqeej1bAxG9Ky-5vx-YAgfqwL/preview"
  ;
  return (
    <div className="container">
      <iframe
        className={styles.iframe}
        src={embedURL}
        width="100%"
        height="500px"
      ></iframe>
    </div>
  );
};

export default App;
