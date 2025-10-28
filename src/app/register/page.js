'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Marquee from "../../components/Marquee";
import styles from "../../styles/register.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const router = useRouter();
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = serialNumber.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/person/${encodeURIComponent(trimmed)}`);
  };

  return (
    <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.wrapper}>
        <Marquee className={styles.marquee} speed="10">
          <h5 className={styles.marqueeText}>
            <Link className={styles.marqueeLink} href="/howtoreadmeter.pdf" prefetch={false}>
              If you are having trouble getting your usage... READ: How to read your meter?
            </Link>
          </h5>
        </Marquee>

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>Check Your Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.cardBody}>
              <div className={styles.imageWrap}>
                <Image
                  src="/Images/meter1.webp"
                  alt="Water meter"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                  priority
                />
              </div>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="serial-number" className={styles.label}>
                  Serial Number
                </label>
                <Input
                  id="serial-number"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value)}
                  placeholder="Enter your meter serial number"
                  className={styles.input}
                  required
                />
                <Button type="submit" className={styles.button}>
                  Search
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
