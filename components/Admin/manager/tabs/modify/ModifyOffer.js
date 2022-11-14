import styles from "./ModifyOffer.module.css";
import { useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ModifyShowingProducts from "./ModifyShowingProducts";

function ModifyOffer({
  offerId,
  adminPageData,
  modifyOfferData,
  modifyDefaultInput,
  toast,
  toastOptions,
  insertDefaultInput,
  insertOfferData,
  setInsertOfferData,
}) {
  const router = useRouter();

  const on_offButton_Ref = useRef();
  const on_offLoaderRef = useRef();
  const renameModalRef = useRef();
  const renameInput_ref = useRef();
  const renameInModalButton_ref = useRef();
  const renameInModalLoaderRef = useRef();

  async function getOfferData() {
    let options = {
      url: "http://localhost:8000/getofferdata",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        pwd: "Kamal",
      },
    };
    const response = await axios(options).catch((error) => {
      console.log("Axios Catch Error");
      console.log(error);
    });
    if (!response) {
      return console.log("getofferdata Response Error 404");
    }
    if (response.data.success === true) {
      modifyOfferData.setModifyOfferData({ [offerId]: { ...response.data.offersData[0] } });
    }
  }

  useEffect(() => {
    if (modifyOfferData.modifyOfferData) {
      if (!modifyOfferData.modifyOfferData[offerId]) {
        getOfferData();
      }
    } else {
      getOfferData();
    }
  }, []);

  function showLoader(ref, color) {
    if (color === "blue") {
      ref.current.classList.remove(styles.loader_show_red);
      ref.current.classList.add(styles.loader_show_blue);
    } else if (color === "red") {
      ref.current.classList.remove(styles.loader_show_blue);
      ref.current.classList.add(styles.loader_show_red);
    } else {
      ref.current.classList.remove(styles.loader_show_blue);
      ref.current.classList.remove(styles.loader_show_red);
    }
  }

  function on_off() {
    on_offButton_Ref.current.disabled = true;
    if (modifyOfferData.modifyOfferData[offerId].display === false) {
      showLoader(on_offLoaderRef, "red");
      on_off_request(true);
    } else {
      showLoader(on_offLoaderRef, "blue");
      on_off_request(false);
    }
  }

  async function on_off_request(on) {
    let options = {
      url: "http://localhost:8000/offertoggle",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
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
      console.log(error);
      toast.error("Axios Catch Error", toastOptions);
      on_offButton_Ref.current.disabled = false;
      showLoader(on_offLoaderRef, "hide");
      return;
    });
    if (!response.data) {
      modifyOfferData.setModifyOfferData((prev) => ({
        ...prev,
        [offerId]: { ...modifyOfferData.modifyOfferData[offerId], display: false },
      }));
      on_offButton_Ref.current.disabled = false;
      showLoader(on_offLoaderRef, "hide");
      toast.error("Response Error", toastOptions);
      return;
    }
    modifyOfferData.setModifyOfferData((prev) => ({
      ...prev,
      [offerId]: { ...modifyOfferData.modifyOfferData[offerId], display: response.data.display },
    }));
    on_offButton_Ref.current.disabled = false;
    showLoader(on_offLoaderRef, "hide");
    toast.success(`Offer Successfully ${on === true ? "ON" : "OFF"}`, toastOptions);
    on_off_InContext(on);
  }

  async function on_off_InContext(on) {
    // on_off in adminPageData ===> that is an array
    if (adminPageData.adminPageData) {
      const adminTemp = [];
      for (let index = 0; index < adminPageData.adminPageData.length; index++) {
        if (adminPageData.adminPageData[index]._id === offerId) {
          adminPageData.adminPageData[index].display = on;
        }
        adminTemp.push(adminPageData.adminPageData[index]);
      }
      adminPageData.setAdminPageData(adminTemp);
    }

    // on_off in modifyOfferData.modifyOfferData[offerId] ===> object
    modifyOfferData.setModifyOfferData((prev) => ({
      ...prev,
      [offerId]: { ...modifyOfferData.modifyOfferData[offerId], display: on },
    }));
  }

  function confirmDelete() {
    const answer = window.confirm(`Delete this offer?\nOffer = ${modifyOfferData.modifyOfferData[offerId].name}`);
    if (answer) {
      deleteOffer();
    } else {
      return;
    }
  }

  async function deleteOffer() {
    let activeOffers;
    if (modifyOfferData.modifyOfferData[offerId].offers.length === 0) {
      activeOffers = null;
    } else {
      activeOffers = modifyOfferData.modifyOfferData[offerId].offers;
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
        activeOffers,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    if (!response) return toast.error("Response Error", toastOptions);
    if (response.data.success === true) {
      deleteFromContext();
      router.push("/admin/offers");
      return;
    }
    toast.error("Response Error", toastOptions);
  }

  function deleteFromContext() {
    // delete from adminPageData ===> that is an array
    if (adminPageData.adminPageData) {
      const adminTemp = [];
      for (let index = 0; index < adminPageData.adminPageData.length; index++) {
        if (adminPageData.adminPageData[index]._id !== offerId) {
          adminTemp.push(adminPageData.adminPageData[index]);
        }
      }
      adminPageData.setAdminPageData(adminTemp);
    }
    // delete from modifyOfferData.modifyOfferData[offerId] ===> that is an object
    if (modifyOfferData.modifyOfferData[offerId]) {
      modifyOfferData.setModifyOfferData((prevData) => {
        const newData = { ...prevData };
        delete newData[offerId];
        return newData;
      });
    }
  }

  function renameOffer() {
    const offerName = renameInput_ref.current.value;
    if (!offerName) {
      toast.error("Please Enter New Name", toastOptions);
      return;
    }
    if (offerName === modifyOfferData.modifyOfferData[offerId].name) {
      toast.error("Please Enter a Different Name", toastOptions);
      return;
    }
    showLoader(renameInModalLoaderRef, "blue");
    renameOffer_request(offerName);
  }

  async function renameOffer_request(offerName) {
    renameInModalButton_ref.current.disabled = true;
    let activeOffers;
    if (modifyOfferData.modifyOfferData[offerId].offers.length === 0) {
      activeOffers = null;
    } else {
      activeOffers = modifyOfferData.modifyOfferData[offerId].offers;
    }
    let options = {
      url: "http://localhost:8000/renameoffer",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        offerName,
        activeOffers,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      renameInModalButton_ref.current.disabled = false;
      showLoader(renameInModalLoaderRef, "hide");
      toast.error("Axios Catch Error", toastOptions);
      console.error(error);
    });
    if (!response) {
      renameInModalButton_ref.current.disabled = false;
      showLoader(renameInModalLoaderRef, "hide");
      toast.error("Renaming error", toastOptions);

      return console.error("renaming error");
    }
    if (response.data.success === true) {
      renameInModalButton_ref.current.disabled = false;
      showLoader(renameInModalLoaderRef, "hide");
      console.log(response.data);
      toggleRenameModal();
      renameInContext(offerName);
      toast.success("Renamed Successfully", toastOptions);
    }
  }

  function renameInContext(offerName) {
    // rename in adminPageData ===> that is an array
    if (adminPageData.adminPageData) {
      const adminTemp = [];
      for (let index = 0; index < adminPageData.adminPageData.length; index++) {
        if (adminPageData.adminPageData[index]._id === offerId) {
          adminPageData.adminPageData[index].name = offerName;
        }
        adminTemp.push(adminPageData.adminPageData[index]);
      }
      adminPageData.setAdminPageData(adminTemp);
    }
    // rename in modifyOfferData ===> that is an object
    if (modifyOfferData.modifyOfferData[offerId]) {
      modifyOfferData.setModifyOfferData((prev) => ({
        ...prev,
        [offerId]: { ...modifyOfferData.modifyOfferData[offerId], name: offerName },
      }));
    }
  }

  function toggleRenameModal() {
    if (renameModalRef.current.classList.contains(styles.renameModal_show)) {
      renameModalRef.current.classList.remove(styles.renameModal_show);
    } else {
      renameModalRef.current.classList.add(styles.renameModal_show);
      renameInput_ref.current.focus();
    }
  }

  return (
    <div>
      {modifyOfferData.modifyOfferData && modifyOfferData.modifyOfferData.hasOwnProperty(offerId) ? (
        <div className={styles.body}>
          {/* modal */}
          <div
            onClick={(e) => {
              if (e.target !== e.currentTarget) return;
              toggleRenameModal();
            }}
            ref={renameModalRef}
            className={styles.renameModal}
          >
            <div className={styles.nameHeading}>Enter new name: </div>
            <div className={styles.renameModal_inputDiv}>
              <input
                defaultValue={modifyOfferData.modifyOfferData[offerId].name}
                placeholder={modifyOfferData.modifyOfferData[offerId].name}
                ref={renameInput_ref}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    renameOffer();
                  }
                }}
              />
              <button ref={renameInModalButton_ref} onClick={renameOffer}>
                Rename
                <div ref={renameInModalLoaderRef} className={styles.loader}></div>
              </button>
            </div>
          </div>
          {/* modal end */}
          <div className={styles.offerName}>OfferName = {modifyOfferData.modifyOfferData[offerId].name}</div>
          <div className={styles.buttons}>
            <button onClick={toggleRenameModal}>Rename</button>
            <button
              ref={on_offButton_Ref}
              className={modifyOfferData.modifyOfferData[offerId].display === false ? styles.off : ""}
              onClick={on_off}
            >
              Currently {modifyOfferData.modifyOfferData[offerId].display === false ? "OFF" : "ON"}
              <div ref={on_offLoaderRef} className={styles.loader}></div>
            </button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
          <ModifyShowingProducts
            offerId={offerId}
            adminPageData={adminPageData}
            modifyOfferData={modifyOfferData}
            toast={toast}
            toastOptions={toastOptions}
            modifyDefaultInput={modifyDefaultInput}
            insertDefaultInput={insertDefaultInput}
            insertOfferData={insertOfferData}
            setInsertOfferData={setInsertOfferData}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ModifyOffer;
