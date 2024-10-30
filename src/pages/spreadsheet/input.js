// pages/spreadsheet/input.js
import Spreadsheet from '../../components/Spreadsheet';
import styles from './input.module.css'
const Home = () => (
  <div className={styles.horizscroll}>
    <h1>OBCG Meter Readings</h1>
    <div className= {styles.scroll}>
    
    <Spreadsheet />
    </div>
  </div>
);

export default Home;
