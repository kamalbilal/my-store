import axios from "axios";
import { useState, useEffect } from "react";
function db_tester() {
  async function getSearchedProducts(testDiv) {
    let options = {
      url: "http://localhost:8000/test",
      method: "GET",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var startTime = performance.now();
    const response = await axios(options).catch((error) => console.log(error));
    var endTime = performance.now();

    const element = document.createElement("div");
    if (!response) {
      element.innerHTML = "-----------------------------Error-----------------------------";
      testDiv.append(element);
      return;
    }
    element.innerHTML = endTime - startTime;
    testDiv.append(element);
  }

  useEffect(() => {
    const testDiv = document.querySelector(".testDiv");
    // setTimeout(() => {
    //   for (let index = 0; index < 100; index++) {
    //     getSearchedProducts(testDiv);
    //   }
    // }, 1000);
  }, []);

  function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
  }

  return (
    <div>
      <div style={{ fontSize: "1.6rem" }} className="testDiv"></div>
    </div>
  );
}

export default db_tester;
