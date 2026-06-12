import styles from '../../../styles/About.module.css'

const Parade2 = () => (
  <div className={styles.content}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}>
    <video className='fixed z-\[-1\]' controls muted loop style={{ width: '100%', height: '100%' }}
      src="https://res.cloudinary.com/dfnaxhqqq/video/upload/v1666014062/obcg/favicon_lfowpy.mp4" />

  </div>


);

export default Parade2
