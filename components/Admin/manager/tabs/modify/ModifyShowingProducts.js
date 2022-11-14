import styles from "./ModifyShowingProducts.module.css";
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";

function ModifyShowingProducts({
  offerId,
  adminPageData,
  modifyOfferData,
  toast,
  toastOptions,
  modifyDefaultInput,
  insertDefaultInput,
  insertOfferData,
  setInsertOfferData,
}) {
  Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
  };

  const { modifyDefaultInputValues, setModifyDefaultInputValues } = modifyDefaultInput;
  const { insertDefaultInputValues, setInsertDefaultInputValues } = insertDefaultInput;

  useEffect(() => {
    modifyOfferData.modifyOfferData[offerId].allProducts.map((element) => {
      setModifyDefaultInputValues((prev) => ({ ...prev, [element._id]: element.newDiscount }));
    });
  }, [modifyOfferData.modifyOfferData[offerId].allProducts]);

  function inputDiscount(e) {
    const value = e.target.value;
    const id = e.target.id;
    if (!isNaN(value)) {
      if (value <= 100 && value >= 0) {
        setModifyDefaultInputValues((prev) => ({ ...prev, [id]: value * 1 }));
      } else {
        setModifyDefaultInputValues((prev) => ({ ...prev, [id]: value.slice(0, -1) }));
      }
    } else {
      setModifyDefaultInputValues((prev) => ({ ...prev, [id]: value.slice(0, -1) }));
    }
  }

  function inputDiscount_FocusLost(e) {
    const value = e.target.value;
    if (value === "") {
      return (e.target.value = 0);
    }
  }
  function calculatePrecentage(maxPrice, newDiscount) {
    const price_AfterDiscount = (maxPrice - (newDiscount / 100) * maxPrice).round(2);
    return price_AfterDiscount;
  }

  function changeNewDiscount(e) {
    // const maxPrice = e.target.getAttribute("data-maxprice");
    const newDiscount = modifyDefaultInputValues[e.target.id];
    setInsertDefaultInputValues((prev) => ({ ...prev, [e.target.id]: newDiscount }));
    // const percentage = calculatePrecentage(maxPrice, newDiscount);
    addOfferToServer(e.target.id, newDiscount);
  }

  async function addOfferToServer(productId, newDiscount) {
    toast.success(`Changing...`, toastOptions);
    let options = {
      url: "http://localhost:8000/addoffer",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        productId,
        offerId,
        offerName: modifyOfferData.modifyOfferData[offerId].name,
        newDiscount,
        startingDateTime: null,
        endingDateTime: null,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      toast.error("Axios Error", toastOptions);
      console.log(error);
    });

    if (!response) return toast.error("respone error", toastOptions);
    if (response.data.success === true) {
      toast.success(`Changed to ${newDiscount}% OFF`, toastOptions);
      changingNewDiscountInContext(productId, newDiscount);
    }
  }

  async function changingNewDiscountInContext(productId, newDiscount) {
    // Changing newDiscount in modifyOfferData.modifyOfferData[offerId].allProducts
    const temp = [];
    modifyOfferData.modifyOfferData[offerId].allProducts.map((element) => {
      if (element._id === productId) {
        element.newDiscount = newDiscount;
      }
      temp.push(element);
    });
    modifyOfferData.setModifyOfferData((prev) => ({
      ...prev,
      [offerId]: { ...modifyOfferData.modifyOfferData[offerId], allProducts: temp },
    }));
  }

  function confirmDelete(e) {
    const answer = window.confirm(`Delete this product?`);
    if (answer) {
      removeProductFromOffer(e);
    } else {
      return;
    }
  }

  async function removeProductFromOffer(e) {
    const productId = e.target.id;
    let options = {
      url: "http://localhost:8000/removeproductfromoffer",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        productId,
        offerId,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      toast.error(`Axios Error`, toastOptions);
      return console.log(error);
    });

    if (!response) return toast.error(`Response Error`, toastOptions);
    console.log(response.data);
    if (response.data.success === true) {
      toast.success(`Successfully Deleted Prouct`, toastOptions);
      deleteFromContext(productId);
    }
  }

  async function deleteFromContext(productId) {
    // Deleteing from modifyOfferData.modifyOfferData
    if (modifyOfferData.modifyOfferData[offerId]) {
      const tempOffers = [];
      modifyOfferData.modifyOfferData[offerId].offers.map((element) => {
        if (element !== productId) {
          tempOffers.push(element);
        }
      });

      const tempAllProducts = [];
      modifyOfferData.modifyOfferData[offerId].allProducts.map((element) => {
        if (element._id !== productId) {
          tempAllProducts.push(element);
        }
      });
      modifyOfferData.setModifyOfferData((prev) => ({
        ...prev,
        [offerId]: { ...modifyOfferData.modifyOfferData[offerId], offers: tempOffers, allProducts: tempAllProducts },
      }));
    }

    // deleteing in insertDefaultInputValues
    setInsertDefaultInputValues((prevData) => {
      const newData = { ...prevData };
      newData[productId] = 0;
      return newData;
    });

    // reseting newDiscount in insertOfferData
    console.log(insertOfferData);
    if (insertOfferData) {
      const tempInsertOfferData = insertOfferData[offerId];
      for (let index = 0; index < tempInsertOfferData.length; index++) {
        if (tempInsertOfferData[index]._id === productId) {
          tempInsertOfferData[index].newDiscount = 0;
          break;
        }
      }
      setInsertOfferData((prev) => ({ ...prev, [offerId]: tempInsertOfferData }));
    }

    // subtracting from adminPageData by offerId
    if (adminPageData.adminPageData) {
      console.log(adminPageData);
      const tempAdminPageData = [];
      adminPageData.adminPageData.map((element) => {
        if (element._id === offerId) {
          element.offers = element.offers - 1;
        }
        tempAdminPageData.push(element);
      });
      console.log(tempAdminPageData);
      adminPageData.setAdminPageData(tempAdminPageData);
    }
  }

  useEffect(() => {
    console.log("useEffect");
    if (adminPageData.adminPageData) {
      const tempAdminPageData = [];
      adminPageData.adminPageData.map((element) => {
        if (element._id === offerId) {
          element.offers = modifyOfferData.modifyOfferData[offerId].offers.length;
        }
        tempAdminPageData.push(element);
      });
      console.log(tempAdminPageData);
      adminPageData.setAdminPageData(tempAdminPageData);
    }
  }, [modifyOfferData.modifyOfferData]);

  return (
    <div className={styles.body}>
      {modifyOfferData.modifyOfferData[offerId].allProducts.length > 0 ? (
        modifyOfferData.modifyOfferData[offerId].allProducts.map((element, index) => {
          return (
            <div key={index} className={styles.row}>
              <div>
                <Image src={element.images[0]} width={350} height={350} />
              </div>
              <div className={styles.details}>
                <div>
                  Title: <span>{element.title}</span>
                </div>
                <div>
                  minPrice: <span>${element.minPrice}</span>
                </div>
                <div>
                  maxPrice: <span>${element.maxPrice}</span>
                </div>
                <div>
                  minPrice_AfterDiscount: <span>${element.minPrice_AfterDiscount}</span>
                </div>
                <div>
                  maxPrice_AfterDiscount: <span>${element.maxPrice_AfterDiscount}</span>
                </div>
                <div>
                  discount: <span>{element.discountNumber}% OFF</span>
                </div>
                <div>
                  Product Is Avaliable: <span>{element._display === 1 ? "Yes" : "No"}</span>
                </div>
                <br />
                <div>
                  newDiscount: <span>{element.newDiscount}% OFF</span>
                </div>
                {modifyDefaultInputValues ? (
                  <>
                    <div>
                      Price After newDiscount will be:{" "}
                      <span>${calculatePrecentage(element.maxPrice, modifyDefaultInputValues[element._id])}</span>
                    </div>
                    <div className={styles.input}>
                      <input
                        onBlur={inputDiscount_FocusLost}
                        onInput={inputDiscount}
                        id={element._id}
                        value={modifyDefaultInputValues[element._id]}
                        type="text"
                        autoComplete="off"
                        placeholder="0"
                        data-maxprice={element.maxPrice}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.keyCode === 13) {
                            changeNewDiscount(e);
                          }
                        }}
                      />
                      <div className={styles.button}>
                        <div data-maxprice={element.maxPrice} id={element._id} onClick={changeNewDiscount}>
                          Change
                        </div>
                        <div id={element._id} onClick={confirmDelete}>
                          Delete
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.line}></div>
            </div>
          );
        })
      ) : (
        <div className={styles.noData}>No Data</div>
      )}
    </div>
  );
}

export default ModifyShowingProducts;
