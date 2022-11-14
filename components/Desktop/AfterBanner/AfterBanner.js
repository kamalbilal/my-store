import cn from "classnames";
import styles from "./AfterBanner.module.css";
import { BsCreditCard, BsPeople } from "react-icons/bs";
import { CgShoppingBag } from "react-icons/cg";
import { BiDollarCircle } from "react-icons/bi";

function AfterBanner() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <BsCreditCard className={styles.icon} />
          <div className={styles.detail}>
            <h4 className={styles.title}>Safe Payment</h4>
            <p className={styles.paragraph}>
              Pay with the world's best and reliable payment method
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <CgShoppingBag className={styles.icon} />
          <div className={styles.detail}>
            <h4 className={styles.title}>Shop without worries</h4>
            <p className={styles.paragraph}>
              Pay with the world's best and reliable payment method
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <BiDollarCircle className={styles.icon} />
          <div className={styles.detail}>
            <h4 className={styles.title}>Safe Payment</h4>
            <p className={styles.paragraph}>
              Pay with the world's best and reliable payment method
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <BsPeople className={styles.icon} />
          <div className={styles.detail}>
            <h4 className={styles.title}>Help Center</h4>
            <p className={styles.paragraph}>
              Pay with the world's best and reliable payment method
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AfterBanner;
