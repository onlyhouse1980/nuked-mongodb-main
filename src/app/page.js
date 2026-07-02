'use client';

import Image from "next/image";
import styles from "../styles/styles.module.css";
import * as React from "react";
import { motion, inView } from "framer-motion";
import profileImage from "../../public/Images/WebPFiles/psound.webp";
// import Marquee from "react-fast-marquee";
// import MeetingNotice from "@/components/MeetingNotice"
import Link from "next/link";
import { Button } from "@/components/ui/button";


const PhotoArray = [];

export default function index() {
  return (
    <div>
      

      <div className={styles.mainName}>
        <h2 className={styles.bgText}>
          <b>Orchard Beach</b>
        </h2>
        <h2 className={styles.bgText}>
          <b>Community Group</b>
        </h2>
       //<Marquee>
       //   <MeetingNotice />
       // </Marquee>
      </div>
      <div>
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              opacity: [1, 0, 0, 0, 1],
            }}
            transition={{
              duration: 30,
              ease: "easeInOut",

              repeat: Infinity,
              repeatDelay: 0,
            }}
            className={styles.bgWrap}
          >
            <Image
              className={styles.Psound}
              alt="Whale Sighting"
              src="/Images/WebPFiles/psound.webp"
              fill
              style={{ objectFit: "cover" }}
              quality={50}
              priority
            />
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0, 0, 0],
            }}
            transition={{
              duration: 30,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0,
            }}
            className={styles.bgWrap}
          >
            <Image
              alt="Sunrise"
              src="/Images/WebPFiles/sunrise.webp"
              fill
              style={{ objectFit: "cover" }}
              quality={50}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 0, 1, 0, 0],
            }}
            transition={{
              duration: 30,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0,
            }}
            className={styles.bgWrap}
          >
            <Image
              className={styles.Psound}
              alt="Droplets"
              src="/Images/WebPFiles/boat.webp"
              fill
              style={{ objectFit: "cover" }}
              quality={50}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
          {/* <motion.div animate={{
        opacity: [0, 0, 0, 0, 0],        
      }}
      transition={{
        duration: 12,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0
      }} 
      className={styles.bgWrap}>
      <Image
        alt="Droplets"
        src="/Images/WebPFiles/whale.webp"
        layout="fill"
        objectFit="cover"
        priority
      />
    </motion.div> */}
          <motion.div
            animate={{
              opacity: [0, 0, 0, 1, 0],
            }}
            transition={{
              duration: 30,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0,
            }}
            className={styles.bgWrap}
          >
            <Image
              alt="Orchard Beach"
              src="/Images/WebPFiles/hero-bg.webp"
              fill
              style={{ objectFit: "cover" }}
              quality={50}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 0, 0, 0, 1],
            }}
            transition={{
              duration: 30,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0,
            }}
            className={styles.bgWrap}
          >
            <Image
              alt="Water Droplets"
              src="/Images/WebPFiles/glass_droplets.webp"
              /*filter="blur"*/
              fill
              style={{ objectFit: "cover" }}
              quality={50}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
