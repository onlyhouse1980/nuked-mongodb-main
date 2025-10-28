import styles from "../../styles/executive.module.css";
import Image from "next/image";
// import { motion } from "framer-motion";

/* const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
}; */

/* const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}; */

const Executive = () => (
/*   <div
    exit={{ opacity: 0 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >     */
    <div
      className={styles.bgcontainer}
    //  variants={container}
    //  initial="hidden"
    //  animate="show"
    >
      <h2 className="text-center">
        <b>OBCG</b>
        <br />
        <b>Executive Board</b>
      </h2>
      <div className={styles.divBlock}>
       
        <div className={styles.content}>
          <Image
            src="/Images/WebPFiles/Dennis.webp"
           //  loading="lazy"
            width="300" height="300"
            alt="Member President Photo Dennis"
            className={styles.Image5}
          />
          <div className={styles.contentNameplate}>
            <p>
              President
              <br />
              Dennis Frett
              <br />
              
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <Image
            src="/Images/WebPFiles/IMG-20250624-WA0009.webp"
           //  loading="lazy"
            width="300" height="300"
            alt="Member Vice President Photo Eric Campbell"
            className={styles.Image5}
          />
          <div className={styles.contentNameplate}>
            <p>
              Vice President
              <br />
              Eric Campbell 
              <br />
              
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <Image
            src="/Images/WebPFiles/IMG-20250624-WA0008.webp"
           //  loading="lazy"
            width="300" height="300"
            alt="Member Photo Secretary/Treasurer"
            className={styles.Image5}
          />
          <div className={styles.contentNameplate}>
            <p>
              Secretary/Treasurer
              <br />
              DeeDee Benitez
              <br />
              
            </p>
          </div>
        </div>
      </div>
    </div>
//  </div>
);

export default Executive;
