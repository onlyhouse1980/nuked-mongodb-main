import styles from '../../styles/About.module.css'
import { motion } from 'framer-motion'
import Zoom from 'react-reveal/Zoom'



const video = () => (
<motion.div exit={{ opacity: 0 }} initial={{opacity: 0 }} animate={{opacity: 1 }}>
   
    <Zoom top>
    <motion.div className={styles.content}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}>
      <video 
         src="https://drive.google.com/file/d/1Op6BCXirdL5YD0YOXRKE890U7uzvESOf/preview" controls>
		 </video>
		 
    </motion.div>
    </Zoom>
  </motion.div>

);

export default video;
