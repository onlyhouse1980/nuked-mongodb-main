import React from "react";
import styles from "@/routes/pdfs/misc/minutes/2023Minutes.module.css";

export const App = () => {
  const embedURL = 
    "https://drive.google.com/file/d/1zJRynuWXjQY63jcr04hz_47jMvG_0JBL/preview"
  ;
  return (
    <div className={styles.container}>
      <iframe
        className={styles.iframe}
        src={embedURL}
        width="100%"
        height="500"
      ></iframe>
    </div>
  );
};

export default App;
