import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
  useLocation,
} from "react-router";
import { useProductFetcher, type ApiData } from "../CallApi/CallApiProduct";

import { SortContext } from "../useContext/priceSortContext";
import { IndexContext } from "../useContext/IndexProductContext";

import styles from "./ProductList.module.css";

const PRODUCTS_PER_PAGE = 8;

interface CartItem extends ApiData {
  quantity: number;
}

const DataFetcher: React.FC = () => {
  const { data, loading, error } = useProductFetcher();
  const sortContext = useContext(SortContext);
  const indexContext = useContext(IndexContext);

  const { hash } = useLocation();
  const hashValue = useMemo(() => {
    if (!hash) return;
    const textWithoutHash = hash.replace("#", "");
    return decodeURIComponent(textWithoutHash);
  }, [hash]);
  console.log("Hash value:", hashValue);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const maxPriceQuery = searchParams.get("maxPrice");
  const minPriceQuery = searchParams.get("minPrice");
  const countryQuery = searchParams.getAll("country");
  const brandQuery = searchParams.getAll("brand");
  const priceNumber = (price: string) => {
    return Number(price.replace(/\D/g, ""));
  };
  console.log(new Set(countryQuery));

  const sortedData = useMemo(() => {
    if (!data) return [];
    let dataCopy = [...data];
    if (brandQuery.length > 0) {
      const brandSet = new Set(brandQuery);
      if (brandSet.size > 0) {
        dataCopy = dataCopy.filter((item) => brandSet.has(item.Brand));
      }
    }
    if (hashValue) {
      if (hashValue === "thuốc-theo-đơn") {
        dataCopy = dataCopy.filter((item) => item.Price == "Liên hệ");
      } else if (hashValue === "thuốc-không-theo-đơn") {
        dataCopy = dataCopy.filter((item) => item.Price != "Liên hệ");
      }
    }
    if (countryQuery.length > 0) {
      const countrySet = new Set(countryQuery);

      if (countrySet.size > 0) {
        dataCopy = dataCopy.filter((item) => countrySet.has(item.Manufacturer));
      }
    }
    if (maxPriceQuery || minPriceQuery) {
      const maxPrice = Number(maxPriceQuery) || 1e9;
      const minPrice = Number(minPriceQuery) || 0;

      dataCopy = dataCopy.filter(
        (item) =>
          priceNumber(item.Price) >= minPrice &&
          priceNumber(item.Price) <= maxPrice
      );
    }
    switch (sortContext.typeSort) {
      case "lowToHigh":
        return dataCopy.sort(
          (a, b) => priceNumber(a.Price) - priceNumber(b.Price)
        );
      case "highToLow":
        return dataCopy.sort(
          (a, b) => priceNumber(b.Price) - priceNumber(a.Price)
        );
      default:
        return dataCopy;
    }
  }, [
    data,
    sortContext.typeSort,
    maxPriceQuery,
    minPriceQuery,
    countryQuery,
    brandQuery,
    hashValue,
  ]);
  useEffect(() => {
    setCurrentPage(1);
  }, [maxPriceQuery, minPriceQuery]);

  // Logic Pagination
  const totalPages = Math.ceil(sortedData.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = sortedData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    if (indexContext) {
      indexContext.ChangeCountIndex(indexOfFirstProduct);
    }
  }, [indexOfFirstProduct, indexContext]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toDetailProduct = (id: number) => {
    navigate({
      pathname: "/DetailProduct",
      search: createSearchParams({ productId: id.toString() }).toString(),
    });
  };

  const handleAddToCart = (item: ApiData) => {
    const cartData = localStorage.getItem("shoppingCart");
    const cartItems: CartItem[] = cartData ? JSON.parse(cartData) : [];
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => String(cartItem.SKU) === String(item.SKU)
    );
    if (existingItemIndex < 0) {
      const newItem: CartItem = { ...item, quantity: 1 };
      cartItems.push(newItem);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  };

  if (loading)
    return (
      <div>
        <strong>Đang tải dữ liệu...</strong>
      </div>
    );
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <>
      <div className={styles.hero}>
        {currentProducts.map((item) => (
          <div
            key={item.SKU}
            className={styles.component}
            onClick={() => toDetailProduct(Number(item.SKU))}
          >
            <img src={item.ImageURL} alt={item.ProductName} />
            <div className={styles.desc}>
              {item.ProductName} <span>hỗ trợ </span> {item.Description}
            </div>
            <p className={styles.price}>{item.Price}</p>
            <button
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();

                handleAddToCart(item);
              }}
            >
              Chọn mua
            </button>
          </div>
        ))}
      </div>

      {/* Phần phân trang giữ nguyên */}
      {totalPages > 1 && (
        <nav className={styles.paginationNav}>
          <ul>
            {Array.from(
              { length: totalPages },
              (_, index) =>
                index < 10 && (
                  <li key={index + 1}>
                    <button
                      onClick={() => handlePageChange(index + 1)}
                      className={
                        currentPage === index + 1 ? styles.activePage : ""
                      }
                    >
                      {index + 1}
                    </button>
                  </li>
                )
            )}
          </ul>
          {totalPages > 9 && (
            <button
              style={{
                marginLeft: "8px",
                cursor: "default",
                pointerEvents: "none",
              }}
            >
              ...
            </button>
          )}
        </nav>
      )}
    </>
  );
};

export default DataFetcher;
