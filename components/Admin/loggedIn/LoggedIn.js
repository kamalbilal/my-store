import ReLogin from "./helpers/ReLogin";
import CreateNewOffer from "./helpers/CreateNewOffer";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LoggedIn.module.css";
import OffersDetails from "./helpers/OffersDetails";
import { useContext } from "react";
import { AdminPageData_context, ModifyOfferData_context } from "../../../userContext";
import toast, { Toaster } from "react-hot-toast";

function LoggedIn({ admin }) {
  const { adminPageData, setAdminPageData } = useContext(AdminPageData_context);
  const { modifyOfferData, setModifyOfferData } = useContext(ModifyOfferData_context);

  const toastOptions = {
    style: {
      borderRadius: "10px",
      border: "2px solid white",
      marginRight: "10px",
      background: "#333",
      color: "#fff",
      fontSize: "2rem",
      fontWeight: "bold",
    },
  };

  async function getAllOffers() {
    let options = {
      url: "http://localhost:8000/getalloffers",
      method: "Get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
    let tempArray = [];
    response.data.forEach((element, index) => {
      tempArray.push({ ...response.data[index], offers: element.offers.length });
    });
    setAdminPageData(tempArray.reverse());
  }
  useEffect(() => {
    if (!adminPageData) {
      console.log("Getting getAllOffers");
      getAllOffers();
    }
  }, []);

  function search(input) {
    console.log(adminPageData);
    for (let index = 0; index < adminPageData.length; index++) {
      const element = document.querySelector(`.adminPage-${index}`);
      if (input === "o" || input === "on") {
        const display = element.getAttribute("data-display");
        if (display === "true") {
          element.style.display = "grid";
        } else {
          element.style.display = "none";
        }
      } else if (input === "of" || input === "off") {
        const display = element.getAttribute("data-display");
        console.log({ display, input });
        if (display === "false") {
          element.style.display = "grid";
        } else {
          element.style.display = "none";
        }
      } else {
        const name = element.getAttribute("data-name").toLowerCase();
        console.log({ name, input });
        if (name.includes(input)) {
          element.style.display = "grid";
        } else {
          element.style.display = "none";
        }
      }
    }
  }
  return (
    <div className={styles.body}>
      {/* Toast */}
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {/* Toast End */}
      <ReLogin admin={admin} />
      <div className={styles.row}>
        <CreateNewOffer toast={toast} toastOptions={toastOptions} setAdminPageData={setAdminPageData} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          onInput={(e) => search(e.target.value.toLowerCase())}
        />
        <div
          style={{
            position: "absolute",
            zIndex: "1000",
            left: "186px",
          }}
        ></div>
      </div>
      {adminPageData ? (
        <OffersDetails
          adminPageData={adminPageData}
          setAdminPageData={setAdminPageData}
          modifyOfferData={{ modifyOfferData, setModifyOfferData }}
          toast={toast}
          toastOptions={toastOptions}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default LoggedIn;
