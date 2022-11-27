import styles from "./Buttons.module.css";
import cn from "classnames";
import { MdKeyboardArrowDown } from "react-icons/md";
import Tippy from "@tippyjs/react";

function count(count) {
  if (count && count != 0) {
    return <div className={styles.count}>{count}</div>;
  }
}

function Buttons({ Router, Value, Name, Icon, Count, Color, Show_hide_dropdown_Func }) {
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
      <Tippy className="customTippy tippyMT-10" placement="bottom" theme="light-border" duration={200} animation="scale"  content="Gift">
        <button className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.gift)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Cart") {
    return (
      <Tippy className="customTippy tippyMT-10" duration={200} animation="scale"  placement="bottom" theme="light-border" content="Cart">
        <button onClick={() => Router.push("/cart")} className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.cart)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Heart") {
    return (
      <Tippy className="customTippy tippyMT-10" duration={200} animation="scale"  placement="bottom" theme="light-border" content="Wishlist">
        <button className={Color}>
          {count(Value.count)}
          {<Icon className={cn(IconColor, styles.heart)} />}
        </button>
      </Tippy>
    );
  } else if (Name === "Profile") {
    return (
      <Tippy className="customTippy tippyMT-10" theme="light-border" duration={200} animation="scale"  placement="bottom" content="Profile">
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
