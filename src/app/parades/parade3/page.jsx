import styles from '../../../styles/About.module.css'


const Parade3 = () => (


  <div className={styles.content}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}>
    <video className='fixed z-\[-1\]' controls muted loop style={{ width: '100%', height: '100%' }}
      src="https://res.cloudinary.com/dfnaxhqqq/video/upload/v1657634987/obcg/OBCG_2022_16x9_qrxgj6.mp4#t=0.001" />

  </div>


);

export default Parade3;