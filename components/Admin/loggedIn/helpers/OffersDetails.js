import styles from "./OffersDetails.module.css";
import cn from "classnames";
import axios from "axios";
import Link from "next/link";

function OffersDetails({ adminPageData, setAdminPageData, modifyOfferData, toast, toastOptions }) {
  async function setAdminPageData_Func(index, value) {
    const tempArray = adminPageData;
    tempArray[index] = { ...tempArray[index], display: value };
    setAdminPageData([...tempArray]);
  }
  async function setModifyOfferData_Func(offerId, value) {
    if (modifyOfferData.modifyOfferData) {
      if (modifyOfferData.modifyOfferData.hasOwnProperty(offerId)) {
        modifyOfferData.setModifyOfferData((prev) => ({
          ...prev,
          [offerId]: { ...modifyOfferData.modifyOfferData[offerId], display: value },
        }));
      }
    }
  }

  async function deleteFrom_adminPageData(offerId) {
    console.log(offerId);
    // return;
    let tempArray = [];
    for (let index = 0; index < adminPageData.length; index++) {
      if (adminPageData[index]._id != offerId) {
        tempArray.push(adminPageData[index]);
      }
    }
    setAdminPageData(tempArray);
  }
  async function deleteFrom_modifyOfferData(offerId) {
    // delete from modifyOfferData.modifyOfferData[offerId] ===> that is an object
    if (modifyOfferData.modifyOfferData) {
      if (modifyOfferData.modifyOfferData.hasOwnProperty(offerId)) {
        modifyOfferData.setModifyOfferData((prevData) => {
          const newData = { ...prevData };
          delete newData[offerId];
          return newData;
        });
      }
    }
  }

  function confirmDelete(offerId, offers) {
    const answer = window.confirm(`Delete this offer?`);
    if (answer) {
      deleteOffer(offerId, offers);
    } else {
      return;
    }
  }

  async function deleteOffer(offerId, offers) {
    toast.success("Deleting Offer...", toastOptions);

    if (offers.length === 0) {
      offers = null;
    }
    let options = {
      url: "http://localhost:8000/deleteoffer",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        activeOffers: offers,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      toast.error("Axios Error", toastOptions);
      return console.log(error);
    });
    if (!response) return toast.error("Response Error", toastOptions);
    if (response.data.success === true) {
      toast.success("Deleted Successfully", toastOptions);
      deleteFrom_adminPageData(offerId);
      deleteFrom_modifyOfferData(offerId);
    }
  }

  async function on_Off(offerId, on, index) {
    toast.success("Turning...", toastOptions);
    let options = {
      url: "http://localhost:8000/offertoggle",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        on_off: on,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      toast.success("Axios Error", toastOptions);
      return console.log(error);
    });
    if (!response) return toast.error("Response Error", toastOptions);
    if (response.data.success === true) {
      toast.success(`Offer Successfully ${on === true ? "ON" : "OFF"}`, toastOptions);
      setAdminPageData_Func(index, on);
      setModifyOfferData_Func(offerId, on);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.offerDetailsTitle}>Showing Offers Details:</div>
      <div className={styles.dataDiv}>
        {adminPageData
          ? adminPageData.map((element, index) => {
              if (index === 0) {
                return (
                  <div key={index}>
                    <div className={styles.dataTitles}>
                      <div className={cn(styles.name, styles.colorWhite)}>Offer Name</div>
                      <div className={cn(styles.options, styles.colorWhite)}>
                        <div>Total Products</div>
                        <div>
                          <div>On/Off</div>
                        </div>
                        <div>Manage</div>
                        <div className={styles.delete}>Delete</div>
                      </div>
                    </div>
                    {/*  */}
                    <div
                      id={index}
                      className={cn(styles.data, `adminPage-${index}`)}
                      data-name={element.name}
                      data-display={element.display}
                    >
                      <div className={styles.name}>{element.name}</div>
                      <div className={cn(styles.options, styles.alloptions)}>
                        <div className={styles.length}>{element.offers}</div>
                        <div>
                          <button
                            onClick={(e) => {
                              if (e.target.classList.contains(styles.checked)) {
                                e.target.classList.remove(styles.checked);
                                on_Off(element["_id"], false, index);
                              } else {
                                e.target.classList.add(styles.checked);
                                on_Off(element["_id"], true, index);
                              }
                            }}
                            className={cn(styles.checkbox, element.display === true ? styles.checked : "")}
                          >
                            <div></div>
                          </button>
                        </div>

                        <button className={styles.manageBtn}>
                          <Link href={`/admin/offers/manager?id=${element["_id"]}`}>
                            <a>Manage</a>
                          </Link>
                        </button>
                        <button onClick={() => confirmDelete(element["_id"], element.offers)} className={styles.delete}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  id={index}
                  className={cn(styles.data, `adminPage-${index}`)}
                  data-name={element.name}
                  data-display={element.display}
                >
                  <div className={styles.name}>{element.name}</div>
                  <div className={cn(styles.options, styles.alloptions)}>
                    <div className={styles.length}>{element.offers}</div>
                    <div>
                      <button
                        onClick={(e) => {
                          if (e.target.classList.contains(styles.checked)) {
                            e.target.classList.remove(styles.checked);
                            on_Off(element["_id"], false, index);
                          } else {
                            e.target.classList.add(styles.checked);
                            on_Off(element["_id"], true, index);
                          }
                        }}
                        className={cn(styles.checkbox, element.display === true ? styles.checked : "")}
                      >
                        <div></div>
                      </button>
                    </div>
                    <button className={styles.manageBtn}>
                      <Link href={`/admin/offers/manager?id=${element["_id"]}`}>
                        <a>Manage</a>
                      </Link>
                    </button>
                    <button onClick={() => confirmDelete(element["_id"], element.offers)} className={styles.delete}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default OffersDetails;
