import styles from "./InsertOffer.module.css";
import { useRef, createRef, useState } from "react";
import ProductQuery from "./ProductQuery";
import { IoSyncCircleSharp } from "react-icons/io5";
import InsertShowingProducts from "./InsertShowingProducts";
import axios from "axios";

function InsertOffer({
  offerId,
  modifyOfferData,
  defaultValuesProductQueryObject,
  insertOfferDataArray,
  insertDefaultInput,
  modifyDefaultInput,
  toast,
  toastOptions,
  count,
}) {
  const allPaginationButtonRefs = useRef();
  const { totalCount, setTotalCount } = count;
  const { insertOfferData, setInsertOfferData } = insertOfferDataArray;

  function createPagination(number) {
    console.log(totalCount);
    const element = [];
    allPaginationButtonRefs.current = [];
    for (let index = 1; index <= number; index++) {
      const newRef = createRef();
      allPaginationButtonRefs.current.push(newRef);
      element.push(
        <button
          key={index}
          className={index === totalCount.active ? styles.active_pagination : ""}
          id={index}
          ref={newRef}
          onClick={activePagination}
        >
          {index}
        </button>
      );
    }
    return element;
  }

  function activePagination(e) {
    const id = e.target.id;
    const previousActives = allPaginationButtonRefs.current;
    previousActives.forEach((element) => {
      element.current.classList.remove(styles.active_pagination);
    });
    e.target.classList.add(styles.active_pagination);

    getAllProducts(id);
  }

  async function getAllProducts(pageNumber) {
    const offerName = modifyOfferData.modifyOfferData[offerId].name;
    const discount = defaultValuesProductQueryObject.defaultValuesProductQuery["discount"];
    const title = defaultValuesProductQueryObject.defaultValuesProductQuery["title"];
    const minPrice = defaultValuesProductQueryObject.defaultValuesProductQuery["minPrice"];
    const maxPrice = defaultValuesProductQueryObject.defaultValuesProductQuery["maxPrice"];
    const minPrice_AfterDiscount = defaultValuesProductQueryObject.defaultValuesProductQuery["minPrice_AfterDiscount"];
    const maxPrice_AfterDiscount = defaultValuesProductQueryObject.defaultValuesProductQuery["maxPrice_AfterDiscount"];
    const limit = defaultValuesProductQueryObject.defaultValuesProductQuery["limit"];
    let options = {
      url: "http://localhost:8000/getallproducts",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        pageNumber: pageNumber,
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
      setTotalCount((prev) => ({ ...prev, active: pageNumber * 1 }));
      toast.success("Success", toastOptions);
    }
  }

  return (
    <div>
      {insertOfferData === null || !insertOfferData.hasOwnProperty(offerId) ? (
        <ProductQuery
          offerId={offerId}
          modifyOfferData={modifyOfferData}
          defaultValuesProductQueryObject={defaultValuesProductQueryObject}
          insertOfferDataArray={insertOfferDataArray}
          setTotalCount={setTotalCount}
          toast={toast}
          toastOptions={toastOptions}
        />
      ) : (
        <>
          {/* ReGet Products */}
          <button onClick={() => setInsertOfferData(null)} className={styles.reGet}>
            <IoSyncCircleSharp />
          </button>
          {/* ReGet Products End */}
          {/* Pagination */}
          <div className={styles.pagination}>{createPagination(totalCount.count)}</div>
          {/* Pagination end */}
          <InsertShowingProducts
            offerId={offerId}
            insertOfferDataArray={insertOfferDataArray}
            insertDefaultInput={insertDefaultInput}
            modifyOfferData={modifyOfferData}
            modifyDefaultInput={modifyDefaultInput}
            toast={toast}
            toastOptions={toastOptions}
          />
        </>
      )}
    </div>
  );
}

export default InsertOffer;
