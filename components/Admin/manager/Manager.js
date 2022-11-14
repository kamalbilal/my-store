import styles from "./Manager.module.css";
import cn from "classnames";
import { useRef, useEffect } from "react";
import ModifyOffer from "./tabs/modify/ModifyOffer";
import { useContext, useState } from "react";
import {
  AdminPageData_context,
  ModifyOfferData_context,
  ModifyDefaultInputValues_context,
  InsertDefaultInputValues_context,
  InsertOfferData_context,
  InsertOfferDataCount_context,
} from "../../../userContext";
import InsertOffer from "./tabs/insert/InsertOffer";
import toast, { Toaster } from "react-hot-toast";

function Manager({ offerId }) {
  const { adminPageData, setAdminPageData } = useContext(AdminPageData_context);
  const { modifyOfferData, setModifyOfferData } = useContext(ModifyOfferData_context);
  const { insertOfferData, setInsertOfferData } = useContext(InsertOfferData_context);
  const { modifyDefaultInputValues, setModifyDefaultInputValues } = useContext(ModifyDefaultInputValues_context);
  const { insertDefaultInputValues, setInsertDefaultInputValues } = useContext(InsertDefaultInputValues_context);
  const { totalCount, setTotalCount } = useContext(InsertOfferDataCount_context);
  const [defaultValuesProductQuery, setDefaultValuesProductQuery] = useState({});
  // const [insertOfferData, setInsertOfferData] = useState(null);

  const modifyRef = useRef();
  const insertRef = useRef();
  const modifyDivRef = useRef();
  const insertDivRef = useRef();

  function modifyTabClicked() {
    insertRef.current.classList.remove(styles.tab_active);
    modifyRef.current.classList.add(styles.tab_active);
    insertDivRef.current.classList.add(styles.none);
    modifyDivRef.current.classList.remove(styles.none);
  }
  function insertTabClicked() {
    modifyRef.current.classList.remove(styles.tab_active);
    insertRef.current.classList.add(styles.tab_active);
    modifyDivRef.current.classList.add(styles.none);
    insertDivRef.current.classList.remove(styles.none);
  }
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

  useEffect(() => {
    console.log(insertDefaultInputValues);
  }, [insertDefaultInputValues]);

  return (
    <div className={styles.body}>
      {/* Toast */}
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {/* Toast End */}
      <div className={styles.tabs}>
        <button onClick={modifyTabClicked} ref={modifyRef} className={cn(styles.tab, styles.tab_active)}>
          Modify
        </button>
        <button onClick={insertTabClicked} ref={insertRef} className={styles.tab}>
          Insert
        </button>
      </div>

      {/* content */}
      <div ref={modifyDivRef} className={styles.modifyDiv}>
        <ModifyOffer
          adminPageData={{ adminPageData, setAdminPageData }}
          modifyOfferData={{ modifyOfferData, setModifyOfferData }}
          offerId={offerId}
          modifyDefaultInput={{ modifyDefaultInputValues, setModifyDefaultInputValues }}
          insertDefaultInput={{ insertDefaultInputValues, setInsertDefaultInputValues }}
          toast={toast}
          toastOptions={toastOptions}
          insertOfferData={insertOfferData}
          setInsertOfferData={setInsertOfferData}
        />
      </div>
      <div ref={insertDivRef} className={cn(styles.insertDiv, styles.none)}>
        <InsertOffer
          offerId={offerId}
          defaultValuesProductQueryObject={{ defaultValuesProductQuery, setDefaultValuesProductQuery }}
          insertOfferDataArray={{ insertOfferData, setInsertOfferData }}
          insertDefaultInput={{ insertDefaultInputValues, setInsertDefaultInputValues }}
          modifyOfferData={{ modifyOfferData, setModifyOfferData }}
          modifyDefaultInput={{ modifyDefaultInputValues, setModifyDefaultInputValues }}
          toast={toast}
          toastOptions={toastOptions}
          count={{ totalCount, setTotalCount }}
        />
      </div>
    </div>
  );
}

export default Manager;
