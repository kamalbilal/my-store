import Image from "next/image";
import styles from "./CartItems.module.css";
import Item from "./helpers/Item";
import { ImRadioUnchecked } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import cn from "classnames"

function CartItems({ cartData }) {
  const { cartNumber, setCartNumber } = cartData;
  const [checkedButtonsData, setCheckedButtonsData] = useState({});

  useEffect(() => {
    console.log(checkedButtonsData);
  }, [checkedButtonsData]);

  console.log(cartNumber);
  return (
    <div>
      {cartNumber.hasOwnProperty("data")
        ? Object.values(cartNumber.data).map((element, index) => {
            return <Item key={index} cn={cn} Image={Image} data={element} ImRadioUnchecked={ImRadioUnchecked} FaCheckCircle={FaCheckCircle} checkedButtonsData={checkedButtonsData} setCheckedButtonsData={setCheckedButtonsData} useEffect={useEffect} />;
          })
        : "Loading"}
    </div>
  );
}

export default CartItems;
