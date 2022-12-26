import styles from "./Item.module.css";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";

function Item({ openWishListDialog, Image, cn, data, ImRadioUnchecked, FaCheckCircle, SlArrowRight, checkedButtonsData, setCheckedButtonsData, HiOutlineTrash, RiHeart2Line, FiEdit, useEffect }) {
  const router = useRouter();
  useEffect(() => {
    setCheckedButtonsData((prev) => ({ ...prev, [data.cartName]: false }));
  }, []);
  // console.log(data);
  return (
    <div className={styles.item}>
      <div className={styles.itemSelectDiv}>
        {checkedButtonsData.hasOwnProperty(data.cartName) ? (
          checkedButtonsData[data.cartName] === true ? (
            <FaCheckCircle onClick={() => setCheckedButtonsData((prev) => ({ ...prev, [data.cartName]: false }))} className={cn(styles.check, "unselectable")} />
          ) : (
            <ImRadioUnchecked className={cn(styles.check, "unselectable")} onClick={() => setCheckedButtonsData((prev) => ({ ...prev, [data.cartName]: true }))} />
          )
        ) : (
          <ImRadioUnchecked className={cn(styles.check, "unselectable")} />
        )}
        <div className="unselectable">
          <Image src={data["selectedImageUrl"]} width={130} height={130} draggable="false" />
        </div>
      </div>

      {/* title etc */}
      <div className={styles.details}>
        <div>
          <div className={styles.titleDiv}>
            <div className={styles.title}>{data["title"]}</div>

            <Tippy trigger="mouseenter" className="customTippy" placement="top" duration={200} theme="light-border" animation="scale" arrow={true} allowHTML={true} content={<div>Edit</div>}>
              <button
                onClick={() => {
                  router.push(
                    `/product/${data["longProductId"]}.html?select=${Object.values(data["selectedProperties"])
                      .map((el) => el["Data"].replace(";", ""))
                      .join("-")}&q=${data["selectedQuantity"]}&s=${data["selectedShippingDetails"]["index"] + ":" + data["selectedShippingDetails"]["company"]}`
                  );
                }}
                className={styles.editIcon}
              >
                <FiEdit />
              </button>
            </Tippy>

            <Tippy trigger="mouseenter" className="customTippy" placement="top" duration={200} theme="light-border" animation="scale" arrow={true} allowHTML={true} content={<div>Add to wishlist</div>}>
              <button data-attribute-productid={data["productId"]} data-attribute-imageurl={data["selectedImageUrl"]} data-attribute-cartid={data["cartId"]} data-attribute-cartname={data["cartName"]} onClick={openWishListDialog} className={styles.heartIcon}>
                <RiHeart2Line />
              </button>
            </Tippy>

            <Tippy trigger="mouseenter" className="customTippy" placement="top" duration={200} theme="light-border" animation="scale" arrow={true} allowHTML={true} content={<div>Delete</div>}>
              <button className={styles.trashIcon}>
                <HiOutlineTrash />
              </button>
            </Tippy>
          </div>
          <button className={styles.properties}>
            {Object.values(data["selectedProperties"])
              .map((el) => el.selected)
              .join("/")}
            <span className={styles.arrowIcon}>
              <SlArrowRight />
            </span>
          </button>
        </div>
        <div className={styles.priceDiv}>
          <div>
            <div className={styles.price}>US ${data["selectedPrice"]}</div>
            <div className={styles.quantityPrice}>Quantity: {data["selectedQuantity"]}</div>
            <div className={styles.shippingPrice}>Shipping fee: {data["selectedShippingPrice"] == 0 ? "Free" : `$${data["selectedShippingPrice"]}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
