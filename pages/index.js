import cn from "classnames";
import AfterBanner from "../components/Desktop/AfterBanner/AfterBanner";
import Banner from "../components/Desktop/Banner/Banner";
// import Footer from "../components/Desktop/Footer/Footer";
// import Navbar from "../components/Desktop/NavBar/Navbar";
import ProductOffers from "../components/Universal/ProductOffers/ProductOffers";
import styles from "./index.module.css";
export default function Home() {
  //  For <ProductOffers />
  const ProductsDataArray = [
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: null,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
    {
      productName: "Soft Fluffy Makeup Brushes",
      productLink: "",
      imageLink: "/product.webp",
      orignalPrice: 7.4,
      afterDiscountPrice: 2.7,
    },
  ];
  return (
    <div>
      {/* <div className={styles.navBar}>
        <Navbar />
      </div> */}
      <div>
        <Banner />
        <AfterBanner />
        <ProductOffers
          Title={"Trending Now"}
          // Time={Date.now() + 500000000}
          ShowAll_Link_button={""}
          ProductsData={ProductsDataArray}
        />
        <ProductOffers
          Title={"Daily Offer's"}
          Time={Date.now() + 500000000}
          ShowAll_Link_button={""}
          ProductsData={ProductsDataArray}
        />
        <ProductOffers
          Title={"Recommended"}
          // Time={Date.now()}
          ShowAll_Link_button={""}
          ProductsData={ProductsDataArray}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
