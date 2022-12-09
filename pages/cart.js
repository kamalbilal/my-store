import { CartContext, WishLishContext } from "../userContext";
import { useContext, useEffect, useState, useRef } from "react";
import CartItems from "../components/Cart/CartItems";
import styles from "../styles/cart.module.css";
import cn from "classnames";
import { ImRadioUnchecked } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { RiHeart2Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

function Cart() {
  const { cartNumber, setCartNumber } = useContext(CartContext);
  const { wishLishData, setWishLishData} = useContext(WishLishContext);
  const [checkedButtonsData, setCheckedButtonsData] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const uncheckAllRef = useRef()

  useEffect(() => {
    let allSelected= true
    const keys = Object.keys(checkedButtonsData)
    
    for (let index = 0; index < keys.length; index++) {
      if (checkedButtonsData[keys[index]] === false) {
        allSelected = false
        break;
      }
    }
    if (allSelected === true && keys.length > 0) {
      setSelectAll(true)
    } else {
      uncheckAllRef.current = false
      setSelectAll(false)
    }
  }, [checkedButtonsData]);

  useEffect(() => {
    if (selectAll === true) {
      checkAllItems();
    } else if(uncheckAllRef.current === true && selectAll === false) {
      unCheckAllItems();
    }
  }, [selectAll]);

  function checkAllItems() {
    setCheckedButtonsData((prev) => {
      const temp = {};
      Object.keys(prev).map((key) => {
        temp[key] = true;
      });
      return temp;
    });
  }
  function unCheckAllItems() {
    setCheckedButtonsData((prev) => {
      const temp = {};
      Object.keys(prev).map((key) => {
        temp[key] = false;
      });
      return temp;
    });
  }

  return (
    <div className={styles.cart}>
      <div>
        <div className={cn(styles.shoppingTitleDiv, styles.niceBox)}>
          <h1>My Shopping Cart ({cartNumber.count || 0})</h1>
          <button className={styles.selectAllBtn} onClick={() => {uncheckAllRef.current = true;setSelectAll((prev) => !prev)}}>
            {selectAll === true ? (
              <FaCheckCircle className={cn(styles.check, "unselectable")} />
            ) : (
              <ImRadioUnchecked className={cn(styles.check, "unselectable")}  />
            )}
            Select all
          </button>
        </div>
        <div className={cn(styles.content, styles.niceBox)}>
          <CartItems cartData={{ cartNumber, setCartNumber }} wishLishContent={{wishLishData, setWishLishData}} ImRadioUnchecked={ImRadioUnchecked} FaCheckCircle={FaCheckCircle} cn={cn} checkedButton={{ checkedButtonsData, setCheckedButtonsData }} HiOutlineTrash={HiOutlineTrash} RiHeart2Line={RiHeart2Line} FiEdit={FiEdit} useEffect={useEffect} useState={useState} />
        </div>
      </div>

      {/* checkout */}
      <div>checkout</div>
    </div>
  );
}

export default Cart;
