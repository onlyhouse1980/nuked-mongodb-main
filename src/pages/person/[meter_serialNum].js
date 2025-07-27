import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Zoom from "react-reveal";
import styles from "./[meter_serialNum].module.css";
import * as React from "react";
import BGBlack from "../../components/BGBlack";
import Link from 'next/link'

import { MDBBtn } from "mdbreact";

//<div suppressHydrationWarning={true}>{process.browser}</div>;
var bgColors = {
  Default: "#81b71a",
  Blue: "#00B1E1",
  Cyan: "#37BC9B",
  Green: "#8CC152",
  Red: "#E9573F",
  Yellow: "#F6BB42",
};
const User = () => {
  const router = useRouter();
  const { meter_serialNum } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (meter_serialNum) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/people/${meter_serialNum}`);
          const data = await res.json();
          if (res.ok) {
            setUser(data.data);
          } else {
            setError(data.message);
          }
        } catch (error) {
          setError('An error occurred while fetching the user.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [meter_serialNum]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  function sayHi() {
    let info1 = parseInt(document.getElementById("info1").value);
    let info2 = parseInt(document.getElementById("info2").value);
    var Answer = document.getElementById("Answer");
    Answer.value = info1 - info2;
  }

 /*  function usedSofar(props) {
    let info1 = parseInt(document.getElementById("info1").value);
    let info2 = parseInt(document.getElementById("info2").value);
    var Answer = document.getElementById("thisYear");
    Answer.value = Number(info1 - info2) + Number(Answer.value);
  } */

 /*  function moreInfo(props) {
    let info1 = parseInt(document.getElementById("info1").value);
    let info2 = parseInt(document.getElementById("info2").value);
    let info3 = 48000;
    var Answer = document.getElementById("Percent");

    Answer.value = (((info1 - info2) / info3) * 100).toFixed(0) + "%";
  } */

  return (
    <>
      <Zoom top cascade>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th2}>
                <h4>
                  <span> Meter Serial # : {user.meter_serialNum}</span>
                  <br />
                </h4>
              </th>
              <th className={styles.th2}>
                <h4>
                  <span>{user.last_name} </span>
                </h4>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.th}>
                <p className={styles.p}>
                  Enter reading from your meter in the box to the right.
                  <br />
                  (digits only - no, seperator eg. 1536987)
                  <br />
                  <br /> Then click the calculate button below that.*
                </p>
              </td>
              <td className={styles.thInput}>
                <input
                  style={{
                    backgroundColor: bgColors.Cyan,
                  }}
                  type="text"
                  id="info1"
                  label="your reading"
                  placeholder="Enter Your Reading"
                  name="uInput"
                ></input>
                <br />
                <MDBBtn
                  gradient="blue"
                  onClick={() => {
                    sayHi();
                    // usedSofar();
                    // moreInfo();
                  }}
                >
                  Calculate
                </MDBBtn>
              </td>
            </tr>
            <tr>
              <td className={styles.td3}>
                <p className={styles.p}></p>
                <p className={styles.p}>Last reading - Aug 01, 2025</p>
              </td>
              <td className={styles.td3}>
                <input
                  style={{
                    backgroundColor: bgColors.Blue,
                  }}
                  type="text"
                  id="info2"
                  label="June 01, 2025"
                  value={user.aug01_25}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className={styles.td3}>
                <p className={styles.p}>
                  Gallons used since Aug 01, 2025.
                </p>
              </td>
              <td className={styles.td3}>
                <input
                  style={{
                    backgroundColor: bgColors.Blue,
                  }}
                  type="text"
                  name="utilized"
                  id="Answer"
                  label="answers"
                  readOnly
                ></input>
              </td>
            </tr>
            

            <tr>
              <td className={styles.h5head}>
                <h5>
                  *If you are having problems with this
                  <br />
                  form, we recommend reading &quot;
                  <Link href="/howtoreadmeter.pdf">How to read your meter?</Link>
                  &quot;{" "}
                </h5>
              </td>
              <td className={styles.td0}></td>
            </tr>
          </tbody>
        </table>
      </Zoom>

      <style jsx>{`
        Link {
          color: red;
        }
      `}</style>
    </>
  );
}

export default User
