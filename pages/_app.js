import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import styles from "./index.module.css";
import Navbar from "../components/Desktop/NavBar/Navbar";
import Footer from "../components/Desktop/Footer/Footer";
import {
  CartContext,
  GiftContext,
  HeartContext,
  VisitedLinksArray,
  AdminPageData_context,
  ModifyOfferData_context,
  InsertOfferData_context,
  ModifyDefaultInputValues_context,
  InsertDefaultInputValues_context,
  InsertOfferDataCount_context,
  SearchedPageData_context,
  SearchPageNumber_context,
  SearchPageNumberHistory_context,
  UserData_context
} from "../userContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";


function MyApp({ Component, pageProps }) {
  const [cartNumber, setCartNumber] = useState({
    count: 0,
    ids: [],
  }); // default value
  const [giftNumber, setGiftNumber] = useState({ count: 0 }); // dafault value
  const [heartNumber, setHeartNumber] = useState({ count: 0 }); // dafault value
  const [visitedLinksArray, setVisitedLinksArray] = useState([]); // dafault value
  const [adminPageData, setAdminPageData] = useState(null); // dafault value
  const [modifyOfferData, setModifyOfferData] = useState(null); // dafault value
  const [insertOfferData, setInsertOfferData] = useState(null); // dafault value
  const [modifyDefaultInputValues, setModifyDefaultInputValues] = useState(null); // dafault value
  const [insertDefaultInputValues, setInsertDefaultInputValues] = useState(null); // dafault value
  const [totalCount, setTotalCount] = useState(null); // dafault value
  const [searchedData, setSearchedData] = useState({}); // dafault value
  const [pageNumber, setPageNumber] = useState(0); // dafault value
  const [searchPageNumberHistory, setSearchPageNumberHistory] = useState({}); // dafault value
  const [userData, setUserData] = useState({}); // dafault value

  const router = useRouter();
  const forbiddenLinks = ["/register", "/login", "/register/authentication", "/login/authentication"];

  useEffect(() => {
    // console.log(router);
    if (forbiddenLinks.includes(router.asPath)) {
      return;
    }
    let tempArray = visitedLinksArray;
    if (!tempArray.includes(router.asPath)) {
      tempArray.push(router.asPath);
      setVisitedLinksArray(tempArray);
    } else {
      tempArray = tempArray.filter((e) => e !== router.asPath);
      tempArray.push(router.asPath);
      setVisitedLinksArray(tempArray);
    }



    // set user data
    let userDataTemp = localStorage.getItem("userData")
    if (userDataTemp && userDataTemp !== "{}") {
      try {
        userDataTemp = JSON.parse(userDataTemp)
        setUserData(userDataTemp)
      } catch (error) {
        getUserData()
      }
    } else {
      getUserData()
    }
  }, [router]);

  useEffect(() => {
    if (Object.values(userData).length !== 0) {
      localStorage.setItem("userData", JSON.stringify(userData))
    } else {
      localStorage.removeItem("userData")
    }
  }, [userData])


  async function getUserData() {
    const url = "http://localhost:8000/getUserData";
    let options = {
      url: url,
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        pwd: "Kamal",
      },
      // const response = await fetch(url, options);
    };


    const response = await axios(options);
    console.log(response);
    if (response.data.success === true) {
      setUserData(response.data.data)
    } else {
      setUserData({})
    }

  }

  useEffect(() => {
    console.log(visitedLinksArray);
  }, [visitedLinksArray, router]);

  function app(path) {
    if (path.includes("/admin/")) {
      return (
        <InsertOfferDataCount_context.Provider value={{ totalCount, setTotalCount }}>
          <InsertOfferData_context.Provider value={{ insertOfferData, setInsertOfferData }}>
            <InsertDefaultInputValues_context.Provider value={{ insertDefaultInputValues, setInsertDefaultInputValues }}>
              <ModifyDefaultInputValues_context.Provider value={{ modifyDefaultInputValues, setModifyDefaultInputValues }}>
                <ModifyOfferData_context.Provider value={{ modifyOfferData, setModifyOfferData }}>
                  <AdminPageData_context.Provider value={{ adminPageData, setAdminPageData }}>
                    <NextNProgress height={6} color="#3b82f6" options={{ showSpinner: false }} />
                    <Component {...pageProps} />
                  </AdminPageData_context.Provider>
                </ModifyOfferData_context.Provider>
              </ModifyDefaultInputValues_context.Provider>
            </InsertDefaultInputValues_context.Provider>
          </InsertOfferData_context.Provider>
        </InsertOfferDataCount_context.Provider>
      );
    } else {
      return (
        <UserData_context.Provider value={{ userData, setUserData }}>
          <SearchPageNumberHistory_context.Provider value={{ searchPageNumberHistory, setSearchPageNumberHistory }}>
            <SearchPageNumber_context.Provider value={{ pageNumber, setPageNumber }}>
              <SearchedPageData_context.Provider value={{ searchedData, setSearchedData }}>
                <VisitedLinksArray.Provider value={{ visitedLinksArray, setVisitedLinksArray }}>
                  <HeartContext.Provider value={{ heartNumber, setHeartNumber }}>
                    <GiftContext.Provider value={{ giftNumber, setGiftNumber }}>
                      <CartContext.Provider value={{ cartNumber, setCartNumber }}>
                        <div className={styles.navBar}>
                          <Navbar />
                        </div>
                        <div className={styles.content}>
                          <NextNProgress height={6} color="#3b82f6" options={{ showSpinner: false }} />
                          <Component {...pageProps} />
                        </div>
                        <Footer />
                      </CartContext.Provider>
                    </GiftContext.Provider>
                  </HeartContext.Provider>
                </VisitedLinksArray.Provider>
              </SearchedPageData_context.Provider>
            </SearchPageNumber_context.Provider>
          </SearchPageNumberHistory_context.Provider>
        </UserData_context.Provider>
      );
    }
  }
  return <>{app(router.pathname)}</>;
}

export default MyApp;
