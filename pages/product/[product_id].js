import { useRouter } from "next/router";

import React from "react";
import ProductLayout from "../../components/ProductPage/ProductLayout";
import Tabs from "../../components/ProductPage/Tabs";

function Product_query({ productData }) {
  productData["priceList"] = {
    InNames: productData.priceList_InNames ? JSON.parse(productData.priceList_InNames) : [],
    InNumbers: productData.priceList_InNumbers ? JSON.parse(productData.priceList_InNumbers) : [],
    Data: productData.priceList_Data ? JSON.parse(productData.priceList_Data) : []
  };
  // if (productData["sizesColors"]) {
  //   productData["sizesColors"] = JSON.parse(productData["sizesColors"])
  // } else {
  //   productData["sizesColors"] = []
  // }
  if (productData["images"]) {
    productData["images"] = JSON.parse(productData["images"])
  } 
  if (productData["shipping"]) {
    productData["shipping"] = JSON.parse(productData["shipping"])
  } 
  if (productData["specs"]) {
    productData["specs"] = JSON.parse(productData["specs"])
  } else {
    productData["specs"] = []
  }

  console.log(productData);
  const router = useRouter();
  const { product_query } = router.query; // contain product name from url
  return (
    <>
      {/* <ProductLayout productData={productData} />
      <Tabs Specifications_Array={productData["specs"]} Description_content={productData["modified_description_content"]} /> */}
    </>
  );
}

export async function getServerSideProps(ctx) {
  // const product_name = ctx.params.product_name;
  const product_id = ctx.params.product_id;
  console.log(product_id);
  if (!product_id.includes(".html")) {
    return {
      notFound: true,
    };
  }

  let res = await fetch(`http://0.0.0.0:8080/getProductData`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: parseInt(product_id.split(".html")[0])}),
  });
  // body: JSON.stringify({ pwd: "Kamal", id: product_id.split(".html")[0], product_name: "product_name" }),

  res = await res.json();
  // if error then redirect to 404 page
  if (res["error"] === true) {
    return {
      notFound: true,
    };
  }

  // res["productId"] = "";
  return {
    props: { productData: res }, // will be passed to the page component as props
  };
}
export default Product_query;
