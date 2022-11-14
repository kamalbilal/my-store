import styles from "./ProductQuery.module.css";
import { useRef, useEffect } from "react";
import cn from "classnames";
import axios from "axios";

function ProductQuery({
  offerId,
  defaultValuesProductQueryObject,
  modifyOfferData,
  insertOfferDataArray,
  setTotalCount,
  toast,
  toastOptions,
}) {
  const discountRef = useRef();
  const titleRef = useRef();
  const minPriceRef = useRef();
  const maxPriceRef = useRef();
  const minPrice_AfterDiscountRef = useRef();
  const maxPrice_AfterDiscountRef = useRef();
  const limitRef = useRef();

  const { defaultValuesProductQuery, setDefaultValuesProductQuery } = defaultValuesProductQueryObject;
  const { insertOfferData, setInsertOfferData } = insertOfferDataArray;

  async function getAllProducts() {
    const offerName = modifyOfferData.modifyOfferData[offerId].name;
    const discount = discountRef.current.value;
    const title = titleRef.current.value;
    const minPrice = minPriceRef.current.value;
    const maxPrice = maxPriceRef.current.value;
    const minPrice_AfterDiscount = minPrice_AfterDiscountRef.current.value;
    const maxPrice_AfterDiscount = maxPrice_AfterDiscountRef.current.value;
    const limit = limitRef.current.value;
    setDefaultValuesProductQuery((prev) => ({
      ...prev,
      discount,
      title,
      minPrice,
      maxPrice,
      minPrice_AfterDiscount,
      maxPrice_AfterDiscount,
      limit,
    }));
    let options = {
      url: "http://localhost:8000/getallproducts",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        pageNumber: 1,
        offerName,
        discount,
        title,
        minPrice,
        maxPrice,
        minPrice_AfterDiscount,
        maxPrice_AfterDiscount,
        limit,
        pwd: "Kamal",
      },
    };

    toast.success("Getting Data...", toastOptions);

    const response = await axios(options).catch((error) => {
      toast.error("Axios Error", toastOptions);
      return console.log(error);
    });

    if (!response) return toast.error("Response Error", toastOptions);
    if (response.data) {
      if (response.data.length === 0) {
        console.log("no data");
        toast.error("Response Error No data", toastOptions);
        return;
      }
      console.log(response.data);
      setInsertOfferData({ [offerId]: response.data.products });
      setTotalCount({ active: 1, count: paginationCount(response.data.totalCount) });
      toast.success("Success", toastOptions);
    }
  }

  function paginationCount(total) {
    const limit = defaultValuesProductQuery["limit"] ? defaultValuesProductQuery["limit"] : 20;
    const wholeNumber = String(total / limit);
    let first = wholeNumber * 1;
    if (wholeNumber.includes(".")) {
      first = wholeNumber.split(".")[0] * 1;
      if (wholeNumber * 1 > first) {
        first += 1;
      }
    }

    if (first === Infinity) {
      throw "Infinity error";
    }
    return first;
  }

  async function saveDefaultValue() {
    const discount = discountRef.current.value;
    const title = titleRef.current.value;
    const minPrice = minPriceRef.current.value;
    const maxPrice = maxPriceRef.current.value;
    const minPrice_AfterDiscount = minPrice_AfterDiscountRef.current.value;
    const maxPrice_AfterDiscount = maxPrice_AfterDiscountRef.current.value;
    const limit = limitRef.current.value;
    setDefaultValuesProductQuery((prev) => ({
      ...prev,
      discount,
      title,
      minPrice,
      maxPrice,
      minPrice_AfterDiscount,
      maxPrice_AfterDiscount,
      limit,
    }));
  }
  return (
    <div className={styles.body}>
      <div className={styles.discount}>
        <div>
          <label>Discount:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              titleRef.current.value = null;
              minPriceRef.current.value = null;
              maxPriceRef.current.value = null;
              minPrice_AfterDiscountRef.current.value = null;
              maxPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["discount"]}
            ref={discountRef}
            placeholder="0-100"
            type="number"
          />
        </div>

        <div>
          <label>Title:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              discountRef.current.value = null;
              minPriceRef.current.value = null;
              maxPriceRef.current.value = null;
              minPrice_AfterDiscountRef.current.value = null;
              maxPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["title"]}
            ref={titleRef}
            placeholder="Name"
            type="text"
          />
        </div>

        <div>
          <label>MinPrice:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              discountRef.current.value = null;
              titleRef.current.value = null;
              maxPriceRef.current.value = null;
              minPrice_AfterDiscountRef.current.value = null;
              maxPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["minPrice"]}
            ref={minPriceRef}
            placeholder="0.0"
            type="number"
          />
        </div>

        <div>
          <label>MaxPrice:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              discountRef.current.value = null;
              titleRef.current.value = null;
              minPriceRef.current.value = null;
              minPrice_AfterDiscountRef.current.value = null;
              maxPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["maxPrice"]}
            ref={maxPriceRef}
            placeholder="0.0"
            type="number"
          />
        </div>

        <div>
          <label>MinPrice_AfterDiscount:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              discountRef.current.value = null;
              titleRef.current.value = null;
              minPriceRef.current.value = null;
              maxPriceRef.current.value = null;
              maxPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["minPrice_AfterDiscount"]}
            ref={minPrice_AfterDiscountRef}
            placeholder="0.0"
            type="number"
          />
        </div>

        <div>
          <label>MaxPrice_AfterDiscount:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              discountRef.current.value = null;
              titleRef.current.value = null;
              minPriceRef.current.value = null;
              maxPriceRef.current.value = null;
              minPrice_AfterDiscountRef.current.value = null;
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["maxPrice_AfterDiscount"]}
            ref={maxPrice_AfterDiscountRef}
            placeholder="0.0"
            type="number"
          />
        </div>

        <div>
          <label>Limit:</label>
          <input
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                getAllProducts();
              }
            }}
            onInput={() => {
              saveDefaultValue();
            }}
            defaultValue={defaultValuesProductQuery["limit"]}
            ref={limitRef}
            placeholder="20"
            type="number"
          />
        </div>

        <button
          onClick={() => {
            getAllProducts();
          }}
          className={cn(styles.newOfferButton, styles.insertButton)}
        >
          Get Products
        </button>
      </div>
    </div>
  );
}

export default ProductQuery;
