import styles from "./Footer.module.css";
import Link from "next/link";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import cn from "classnames";
function Footer() {
  return (
    <div>
      <div className={cn(styles.container, "unselectable")}>
        <div>
          <h1 className={styles.heading}>Get Connected</h1>
          <Link href="#">
            <a className={styles.element}>
              <MdEmail className={styles.icon} />
              <p className={styles.text}>kamalbilalhuawei@gmail.com</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <FaFacebook className={styles.icon} />
              <p className={styles.text}>Store Elexa</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <RiInstagramFill className={styles.icon} />
              <p className={styles.text}>Store Elexa</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <AiFillTwitterCircle className={styles.twitterIcon} />
              <p className={styles.text}>Store Elexa</p>
            </a>
          </Link>
        </div>
        <div>
          <h1 className={styles.heading}>About Us</h1>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Customer Service</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Company information</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>FAQ</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Terms of use</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Privacy policy</p>
            </a>
          </Link>
        </div>
        <div>
          <h1 className={styles.heading}>Customer Services</h1>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Track your order</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Contact Us</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>About Us</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Terms of use</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Privacy policy</p>
            </a>
          </Link>
        </div>
        <div>
          <h1 className={styles.heading}>Current Offers</h1>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Track your order</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Contact Us</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>About Us</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Terms of use</p>
            </a>
          </Link>
          <Link href="#">
            <a className={styles.element}>
              <p className={styles.text}>Privacy policy</p>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>Copyright © 2022 My Company name, Inc. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
