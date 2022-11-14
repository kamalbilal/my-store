import styles from "./Tooltip.module.css";
import { IoMdArrowDropright, IoMdArrowDropup } from "react-icons/io";
import cn from "classnames";

function Tooltip({ children, Place }) {
  if (Place === "left") {
    return (
      <div className={styles.tooltip}>
        <div className={styles.arrow}>
          <IoMdArrowDropright />
        </div>
        {children}
      </div>
    );
  } else if (Place === "bottom") {
    return (
      <div className={cn(styles.tooltip, styles.tooltipBottom)}>
        <IoMdArrowDropup className={cn(styles.arrow, styles.bottom)} />
        {children}
      </div>
    );
  } else if (Place === "bottom-shippingTo") {
    return (
      <div
        className={cn(styles.tooltip, styles.tooltipBottom, styles.shippingTo)}
      >
        <IoMdArrowDropup className={cn(styles.arrow, styles.bottom)} />
        {children}
      </div>
    );
  }
}

export default Tooltip;
