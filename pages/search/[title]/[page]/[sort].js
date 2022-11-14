// import Search from "../components/Search/Search";
import { SearchedPageData_context, SearchPageNumber_context, SearchPageNumberHistory_context } from "../../../../userContext";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/router";
import SearchMain from "../../../../components/Search/SearchMain";
import SearchLeft from "../../../../components/Search/SearchLeft/SearchLeft";

function Search({ urlTitle, urlPage, data, count, sort, countOnEveryRequest, showNextPageAfter }) {
  const router = useRouter();

  const [title, setTitle] = useState(urlTitle);
  const [page, setPage] = useState(urlPage);
  const [sortby, setSortby] = useState(sort);
  const [totalProductsCount, setTotalProductsCount] = useState(count);
  const [titlePageSort, setTitlePageSort] = useState(`${urlTitle}-${urlPage}-${sort}`);
  const [titleSort, setTitleSort] = useState(`${urlTitle}-${sort}`);
  const [displayInGrid, setDisplayInGrid] = useState(true);

  const canRunUseEffect = useRef(true); // do not delete this

  const { searchedData, setSearchedData } = useContext(SearchedPageData_context);
  const { pageNumber, setPageNumber } = useContext(SearchPageNumber_context);
  const { searchPageNumberHistory, setSearchPageNumberHistory } = useContext(SearchPageNumberHistory_context);

  function returnParams(url) {
    const title = url.split("/")[2];
    const page = url.split("/")[3];
    const sortby = url.split("/")[4];
    return { title, page, sortby };
  }

  useEffect(() => {
    setTitle(urlTitle);
  }, [urlTitle]);
  useEffect(() => {
    setTotalProductsCount(count);
  }, [count]);
  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);
  useEffect(() => {
    setSortby(sort);
  }, [sort]);

  useEffect(() => {
    if (canRunUseEffect.current === true) {
      canRunUseEffect.current = false;
      setPageNumber(urlPage * 1);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const params = returnParams(url);
      setTitle(params.title);
      setPage(params.page);
      setSortby(params.sortby);
      setTitlePageSort(`${params.title}-${params.page}-${params.sortby}`);
      setTitleSort(`${params.title}-${params.sortby}`);
      goBack(params.page, params.title, params.sortby);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.asPath, searchPageNumberHistory]);

  function goBack(currentPage, title, sort) {
    let count = 0;
    for (let index = 1; index <= currentPage * 1; index++) {
      if (searchedData.hasOwnProperty(`${title}-${index}-${sort}`)) {
        count += searchedData[`${title}-${index}-${sort}`].length;
      } else {
        if (!searchPageNumberHistory[titleSort].includes(index)) {
          count += countOnEveryRequest;
        }
      }
    }

    if (count !== 0) {
      setPageNumber(count / countOnEveryRequest);
    } else {
      setPageNumber(currentPage * 1);
    }
  }

  useEffect(() => {
    if (pageNumber === 0) return;
    setSearchPageNumberHistory((prev) => {
      if (prev.hasOwnProperty(titleSort)) {
        const exist = prev[titleSort].indexOf(pageNumber);
        if (exist > -1) {
          prev[titleSort].splice(exist, exist);
        }
        return { ...prev, [titleSort]: [...prev[titleSort], pageNumber] };
      } else {
        return { ...prev, [titleSort]: [pageNumber] };
      }
    });
  }, [titleSort, pageNumber]);

  useEffect(() => {
    if (!searchedData) return;
    if (!searchedData.hasOwnProperty(titlePageSort)) {
      setSearchedData((prev) => ({ ...prev, [titlePageSort]: data }));
    }
  }, [data]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20% auto", gap: "10px" }}>
      <div>{/* <SearchLeft pageNumber={pageNumber} pageCounter={pageCounter} searchedData={searchedData} title={title} /> */}</div>

      {searchedData.hasOwnProperty(titlePageSort) ? (
        <SearchMain
          data={{ searchedData, setSearchedData }}
          totalProductsCount={totalProductsCount}
          displayIn={{ displayInGrid, setDisplayInGrid }}
          titlePageSort={titlePageSort}
          page={{ pageNumber, setPageNumber }}
          title={title}
          showNextPageAfter={showNextPageAfter}
          sort={{ sortby, setSortby }}
        />
      ) : (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="lds-dual-ring"></div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ query, req }) {
  // console.log(req.headers.cookie);

  const { title } = query;
  let { page } = query;
  let { sort } = query;

  if (!title) {
    return {
      notFound: true,
    };
  }
  if (!page) {
    page = 1;
  }
  if (!sort) {
    sort = "bestMatch";
  }

  let response = await fetch(`http://localhost:8000/getsearchedproducts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageNumber: page, title, isServer: true, sort }),
  });
  response = await response.json();

  const data = response.products;
  if (data.length === 0) {
    return {
      notFound: true,
    };
  }
  const count = response.count;
  const countOnEveryRequest = response.countOnEveryRequest;
  const showNextPageAfter = response.showNextPageAfter;

  return {
    props: { urlTitle: title, urlPage: page, data, count, sort, countOnEveryRequest, showNextPageAfter },
  };
}

export default memo(Search);
