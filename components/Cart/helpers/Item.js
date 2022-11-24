import styles from "./Item.module.css";
function Item({ Image,cn, data, ImRadioUnchecked, FaCheckCircle, SlArrowRight, checkedButtonsData, setCheckedButtonsData, useEffect }) {

  useEffect(() => {
    setCheckedButtonsData((prev) => ({ ...prev, [data.cartName]: false }));
  }, []);

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
        <Image src={data["images"][0]} width={150} height={150} draggable="false" />
      </div>
      </div>

      {/* title etc */}
      <div className={styles.details}>
        <div className={styles.title}>{data["title"]}</div>
        <button className={styles.properties}>{Object.values(data["selectedProperties"]).map((el) => el.selected).join("/")} <span className={styles.arrowIcon}><SlArrowRight/></span> </button>
      </div>
    </div>
  );
}

export default Item;
