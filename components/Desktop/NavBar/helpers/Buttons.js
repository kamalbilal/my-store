import styles from "./Buttons.module.css";
import cn from "classnames";
import { MdKeyboardArrowDown } from "react-icons/md";
import Tippy from "@tippyjs/react";
import Tooltip from "../../Tooltip/Tooltip";

function count(count) {
  if (count && count != 0) {
    return <div className={styles.count}>{count}</div>;
  }
}

function Buttons({ Value, Name, Icon, Count, Color, Show_hide_dropdown_Func }) {
  let IconColor;
  if (Color !== "red") {
    Color = styles.buttonWrapper;
    IconColor = styles.iconsColorBlue;
  } else {
    Color = cn(styles.buttonWrapper, styles.redOutline);
    IconColor = styles.iconsColorRed;
  }

  if (Name === "Gift") {
    return (
      <Tippy placement="bottom" duration={0} content={<Tooltip Place="bottom">Gift</Tooltip>}>
        <button className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.gift)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Cart") {
    return (
      <Tippy duration={0} placement="bottom" content={<Tooltip Place="bottom">Cart</Tooltip>}>
        <button className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.cart)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Heart") {
    return (
      <Tippy duration={0} placement="bottom" content={<Tooltip Place="bottom">Wishlist</Tooltip>}>
        <button className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.heart)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Profile") {
    return (
      <Tippy duration={0} placement="bottom" content={<Tooltip Place="bottom">Profile</Tooltip>}>
        <button className={cn(Color, styles.profileWrapper)} onClick={Show_hide_dropdown_Func}>
          {count(Count)}
          {<Icon className={cn(IconColor, styles.profile)} />}
          <MdKeyboardArrowDown className={styles.arrow} />
        </button>
      </Tippy>
    );
  }

  return <div>nothing</div>;
}

export default Buttons;
