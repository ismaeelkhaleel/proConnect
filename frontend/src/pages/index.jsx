import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import Userlayout from "@/layout/UserLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {


  const router = useRouter();


  return (
    <Userlayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>


            <p>Connect with Friends without Exaggeration</p>
            <p>A true social media platform, with stories no blufs !</p>

            <div onClick={() => {
              router.push("/login");
            }} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>


          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/image1.png" alt="test image" />
          </div>
        </div>
      </div>
    </Userlayout>
  );
}