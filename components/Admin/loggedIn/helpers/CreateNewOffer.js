import axios from "axios";
import { useRef, useState, useEffect } from "react";

import styles from "./CreateNewOffer.module.css";

function CreateNewOffer({ toast, toastOptions, setAdminPageData }) {
  const [createBtnText, setcreateBtnText] = useState("Create");
  const [createNewOffer_Func_Run, setCreateNewOffer_Func_Run] = useState(true);
  const modalRef = useRef();
  const offerNameRef = useRef();
  const createBtnRef = useRef();

  async function createNewOffer_Func() {
    const offerName = offerNameRef.current.value;
    if (!offerName) {
      toast.error("Please Enter Offer Name", toastOptions);
      return;
    }
    if (createNewOffer_Func_Run === true) {
      setCreateNewOffer_Func_Run(false);
      createBtnRef.current.disabled = true;
      setcreateBtnText("Creating...");
      toast.success("Creating...", toastOptions);

      let options = {
        url: "http://localhost:8000/createnewoffers",
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          offerName,
          pwd: "Kamal",
        },
      };

      const response = await axios(options).catch((error) => {
        setcreateBtnText("Create");
        toast.error("Axios Error", toastOptions);

        console.log(error);
      });

      setcreateBtnText("Create");
      if (!response) return toast.error("Response Error", toastOptions);

      if (!response.hasOwnProperty("data")) return toast.error("Response Data Error", toastOptions);

      if (response["data"]["success"] === true) {
        toast.success("Offer Successfully Created...", toastOptions);
        offerNameRef.current.value = "";
        console.log(response["data"]);
        setAdminPageData((oldArray) => [
          { _id: response["data"]["insertedId"], offers: 0, display: response["data"]["display"], name: offerName },
          ...oldArray,
        ]);
      }
      createBtnRef.current.disabled = false;
      setCreateNewOffer_Func_Run(true);
    }
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* modal */}
      <div
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          modalRef.current.style.display = "none";
        }}
        ref={modalRef}
        className={styles.modal}
      >
        <div>
          <label>New Offer Name: </label>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                createNewOffer_Func();
              }
            }}
            ref={offerNameRef}
            placeholder="Offer name"
            type="text"
          />
          <div className={styles.buttonsDiv}>
            <button ref={createBtnRef} className={styles.button} onClick={() => createNewOffer_Func()}>
              {createBtnText}
            </button>
            <button className={styles.button} onClick={() => (modalRef.current.style.display = "none")}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* modal end*/}

      <button
        onClick={() => {
          modalRef.current.style.display = "block";
          offerNameRef.current.focus();
        }}
        className={styles.newOfferButton}
      >
        Create New Offer
      </button>
    </div>
  );
}

export default CreateNewOffer;
