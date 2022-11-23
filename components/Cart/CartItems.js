import Image from "next/image";
import styles from "./CartItems.module.css";
import Item from "./helpers/Item";

function CartItems({ cartData, ImRadioUnchecked, FaCheckCircle, cn, checkedButton, useEffect }) {
  const { cartNumber, setCartNumber } = cartData;
  const { checkedButtonsData, setCheckedButtonsData } = checkedButton;

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
