import styles from "../modify/ModifyShowingProducts.module.css";
import { useEffect } from "react";
import Image from "next/image";
import axios from "axios";

function InsertShowingProducts({
  offerId,
  insertOfferDataArray,
  insertDefaultInput,
  modifyOfferData,
  modifyDefaultInput,
  toast,
  toastOptions,
}) {
  const { modifyDefaultInputValues, setModifyDefaultInputValues } = modifyDefaultInput;
  const { insertDefaultInputValues, setInsertDefaultInputValues } = insertDefaultInput;
  const { insertOfferData, setInsertOfferData } = insertOfferDataArray;
  console.log(insertOfferData);
  console.log(modifyOfferData.modifyOfferData);

  useEffect(() => {
    insertOfferData[offerId].map((element) => {
      setInsertDefaultInputValues((prev) => ({ ...prev, [element._id]: element.newDiscount }));
    });
  }, [insertOfferData[offerId]]);

  function calculatePrecentage(maxPrice, newDiscount) {
    const price_AfterDiscount = (maxPrice - (newDiscount / 100) * maxPrice).round(2);
    return price_AfterDiscount;
  }
  function inputDiscount_FocusLost(e) {
    const value = e.target.value;
    if (value === "") {
      return (e.target.value = 0);
    }
  }

  function inputDiscount(e) {
    const value = e.target.value;
    console.log(value);
    const id = e.target.id.split("-")[1];
    if (!isNaN(value)) {
      if (value <= 100 && value >= 0) {
        setInsertDefaultInputValues((prev) => ({ ...prev, [id]: value * 1 }));
      } else {
        setInsertDefaultInputValues((prev) => ({ ...prev, [id]: value.slice(0, -1) }));
      }
    } else {
      setInsertDefaultInputValues((prev) => ({ ...prev, [id]: value.slice(0, -1) }));
    }
  }

  function confirmDelete(e) {
    const answer = window.confirm(`Delete this product?`);
    if (answer) {
      removeProductFromOffer(e);
    } else {
      return;
    }
  }

  function alreadyInModify(id) {
    if (modifyOfferData.modifyOfferData.hasOwnProperty(offerId)) {
      const contain = modifyOfferData.modifyOfferData[offerId].offers.includes(id);
      return contain;
    }
  }

  async function addOfferToServer(e, fromInput) {
    const productId = fromInput === true ? e.target.id.split("-")[1] : e.target.id;
    const inputValue = insertDefaultInputValues[productId];
    if (inputValue === 0) {
      console.log("Enter any value");
      toast.error("Enter Any value", toastOptions);
      document.querySelector(`#input-${productId}`).focus();
      return;
    }
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
        newDiscount: inputValue,
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
      toast.success(`Changed to ${inputValue}% OFF`, toastOptions);
      insertProduct(e, fromInput);
    }
  }

  function insertProduct(e, fromInput) {
    const productId = fromInput === true ? e.target.id.split("-")[1] : e.target.id;
    const inputValue = insertDefaultInputValues[productId];
    if (inputValue === 0) {
      console.log("Enter any value");
      toast.error("Enter Any value", toastOptions);
      document.querySelector(`#input-${productId}`).focus();
      return;
    }

    // inserting in modifyOfferData
    let currentElement = null;
    for (let index = 0; index < insertOfferData[offerId].length; index++) {
      if (insertOfferData[offerId][index]._id === productId) {
        currentElement = insertOfferData[offerId][index];
        // changing newDiscount in both modifyOfferData and insertOfferData
        currentElement.newDiscount = inputValue;
        break;
      }
    }
    let tempOffers = modifyOfferData.modifyOfferData[offerId].offers;
    if (tempOffers.includes(productId)) {
      tempOffers = removeElementFromArray(tempOffers, productId);
    }
    tempOffers.push(currentElement._id);

    let tempAllproducts = modifyOfferData.modifyOfferData[offerId].allProducts;
    tempAllproducts = removeElementFromObjectArray(tempAllproducts, "_id", productId);
    tempAllproducts.push(currentElement);
    modifyOfferData.setModifyOfferData((prev) => ({
      ...prev,
      [offerId]: { ...modifyOfferData.modifyOfferData[offerId], offers: tempOffers, allProducts: tempAllproducts },
    }));

    // inserting in modifyDefaultInputValues
    setModifyDefaultInputValues((prev) => ({ ...prev, [productId]: inputValue }));
    console.log(insertOfferData[offerId]);
  }

  async function removeProductFromOffer(e) {
    const productId = e.target.id;
    toast.success(`Deleting...`, toastOptions);
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
      deleteProduct(e);
    }
  }

  function deleteProduct(e) {
    const productId = e.target.id;

    // deleting in modifyOfferData
    const temp = modifyOfferData.modifyOfferData[offerId];
    temp.offers = removeElementFromArray(temp.offers, productId);

    temp.allProducts = removeElementFromObjectArray(temp.allProducts, "_id", productId);
    console.log(temp);

    modifyOfferData.setModifyOfferData((prev) => ({ ...prev, [offerId]: temp }));

    // reseting newDiscount in insertOfferData
    const tempInsertOfferData = insertOfferData[offerId];
    for (let index = 0; index < tempInsertOfferData.length; index++) {
      if (tempInsertOfferData[index]._id === productId) {
        tempInsertOfferData[index].newDiscount = 0;
        break;
      }
    }
    setInsertOfferData((prev) => ({ ...prev, [offerId]: tempInsertOfferData }));

    // deleteing in modifyDefaultInputValues
    setModifyDefaultInputValues((prevData) => {
      const newData = { ...prevData };
      newData[productId] = 0;
      return newData;
    });

    // deleteing in insertDefaultInputValues
    setInsertDefaultInputValues((prevData) => {
      const newData = { ...prevData };
      newData[productId] = 0;
      return newData;
    });
  }

  function removeElementFromArray(array, element) {
    const temp = [];
    for (let index = 0; index < array.length; index++) {
      if (array[index] !== element) {
        temp.push(array[index]);
      }
    }
    return temp;
  }
  function removeElementFromObjectArray(array, matchingElementInArray, element) {
    const temp = [];
    for (let index = 0; index < array.length; index++) {
      if (array[index][matchingElementInArray] !== element) {
        temp.push(array[index]);
      }
    }
    return temp;
  }

  return (
    <div className={styles.bodyForInsert}>
      {insertOfferData[offerId].map((element, index) => {
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
              {insertDefaultInputValues ? (
                <>
                  <div>
                    Price After newDiscount will be:{" "}
                    <span>${calculatePrecentage(element.maxPrice, insertDefaultInputValues[element._id])}</span>
                  </div>
                  <div className={styles.input}>
                    <input
                      onBlur={inputDiscount_FocusLost}
                      onInput={inputDiscount}
                      id={`input-${element._id}`}
                      value={insertDefaultInputValues[element._id]}
                      type="text"
                      autoComplete="off"
                      placeholder="0"
                      data-maxprice={element.maxPrice}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.keyCode === 13) {
                          addOfferToServer(e, true);
                        }
                      }}
                    />
                    <div className={styles.button}>
                      {alreadyInModify(element._id) === false ? (
                        <div id={element._id} onClick={addOfferToServer}>
                          Insert
                        </div>
                      ) : (
                        <>
                          <div data-maxprice={element.maxPrice} id={element._id} onClick={addOfferToServer}>
                            Change
                          </div>
                          <div id={element._id} onClick={confirmDelete}>
                            Delete
                          </div>
                        </>
                      )}
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
      })}
    </div>
  );
}

export default InsertShowingProducts;
