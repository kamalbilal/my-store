import Image from "next/image";
import styles from "./Product.module.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

function Product({ ProductLink, ImageLink, ProductName, OrignalPrice, AfterDiscountPrice }) {
  const [addToCart, setAddToCart] = useState(false);
  const [addToHeart, setAddToHeart] = useState(false);

  const addToCart_Ref = useRef();
  const addToHeart_Ref = useRef();

  function ShowPrice(orignalPrice, discountPrice) {
    if (orignalPrice && !discountPrice) {
      orignalPrice = orignalPrice.toFixed(1);
      const firstDigit = orignalPrice.split(".")[0];
      const secondDigit = orignalPrice.split(".")[1];
      return (
        <div className={styles.price}>
          US ${firstDigit}
          <span className={styles.afterDot}>.{secondDigit}</span>
          {/* <span className={styles.orignalPrice}>12.0</span> */}
        </div>
      );
    } else if (orignalPrice && discountPrice) {
      orignalPrice = orignalPrice.toFixed(1);
      discountPrice = discountPrice.toFixed(1);
      const firstDigit = discountPrice.split(".")[0];
      const secondDigit = discountPrice.split(".")[1];
      return (
        <div className={styles.price}>
          US ${firstDigit}
          <span className={styles.afterDot}>.{secondDigit}</span>
          <span className={styles.orignalPrice}>${orignalPrice}</span>
        </div>
      );
    }
  }

  function addToCart_onClick() {
    // for sending request there is already a useEffect for that --- use that
    if (!addToCart) {
      addToCart_Ref.current.classList.add(styles.addedToCart);
      addToHeart_Ref.current.classList.add(styles.addedToCartHeart);
    } else if (addToCart) {
      addToCart_Ref.current.classList.remove(styles.addedToCart);
      addToHeart_Ref.current.classList.remove(styles.addedToCartHeart);
    }
    setAddToCart((prev) => (prev === true ? false : true));
  }

  useEffect(() => {
    console.log(addToCart);
  }, [addToCart]);

  function addToHeart_onClick() {
    // for sending request there is already a useEffect for that --- use that
    setAddToHeart((prev) => (prev === true ? false : true));
    addToHeart_Ref.current.style.color = addToHeart === true ? "gray" : "red";
  }

  useEffect(() => {
    console.log(addToHeart);
  }, [addToHeart]);

  return (
    <div className={styles.container}>
      <div>
        <Image src={ImageLink} className={styles.image} width={190} height={200} draggable={false} />
      </div>
      <h3 className={styles.productName}>{ProductName}</h3>
      {ShowPrice(OrignalPrice, AfterDiscountPrice)}
      <div className={styles.button}>
        <button ref={addToCart_Ref} onClick={addToCart_onClick} className={styles.cart}>
          <FaShoppingCart />
          {addToCart === true ? "Added to cart" : "Add to cart"}
        </button>
        <button ref={addToHeart_Ref} onClick={addToHeart_onClick} className={styles.heart}>
          <FaHeart />
        </button>
      </div>
    </div>
  );
}

export default Product;
