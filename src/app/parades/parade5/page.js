import styles from '../../../styles/About.module.css'

const Parade2021 = () => (
  <div>
    <div className={styles.content}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}>
      <video className='fixed z-\[-1\]' controls muted loop style={{ width: '100%', height: '100%' }}
        src="https://res.cloudinary.com/dfnaxhqqq/video/upload/v1686317207/obcg/obcg4thupscaled_zvpkwt.mp4#t=0.001" />

    </div>

  </div>

);

export default Parade2021;