import { useRef, useState, useEffect } from "react";

import styles from "../CSS/Header.module.css";

import { useNavigate } from "react-router";

import { createSearchParams } from "react-router";
import { useProductFetcher, type ApiData } from "../../CallApi/CallApiProduct";

export const Header = () => {
  const [valueOfFind, setValueOfFind] = useState<string>("");

  const [productsData, setProductsData] = useState<ApiData[]>([]);

  const [isFocus, setIsFocus] = useState(false);

  const timerRef = useRef<number | null>(null);

  const [isProductList, setIsProductList] = useState(false);

  // const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  // const lastScrollY = useRef(0);

  const productList = isProductList ? styles.active : "";

  // const headerHidden = isHeaderHidden ? styles["header-hidden"] : "";

  const data = localStorage.getItem("shoppingCart") || "[]";

  const ProductList = JSON.parse(data);
  const { data: rawData } = useProductFetcher();

  useEffect(() => {
    // const tmp = localStorage.getItem("products");
    // if (tmp) {
    //   try {
    //     setProductsData(JSON.parse(tmp));
    //   } catch (e) {
    //     console.error("Loi", e);
    //   }
    // }
  }, []);
  useEffect(() => {
    if (rawData) {
      setProductsData(rawData);
    }
  }, [rawData]);

  const navigate = useNavigate();

  const handleSetValueOfFind = (value: string) => {
    setValueOfFind(value);
  };

  const handleSetIsFocusTrue = () => {
    setIsFocus(true);
  };

  const handleSetIsFocusFalse = () => {
    setIsFocus(false);
  };

  const handleProductMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsProductList(true);
  };

  const toDetailProduct = (id: number) => {
    navigate({
      pathname: "/DetailProduct",

      search: createSearchParams({ productId: id.toString() }).toString(),
    });
  };

  const handleProductMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsProductList(false);
    }, 100);
  };

  const landingPageLink = () => {
    window.location.href = "/";
  };

  const loginPageLink = () => {
    window.location.href = "/login";
  };

  const toShoppingCart = () => {
    navigate({
      pathname: "/ShoppingCart",
    });
  };

  return (
    <>
      <header id="header" className={styles.header}>
        <div className={styles.logo}>
          <img
            src="/images/logo.png"
            alt="Logo công ty"
            onClick={landingPageLink}
          />
        </div>

        <nav className={styles.navigation}>
          <a href="/contact">Contact</a>
          <a
            href="/product"
            className={styles.product}
            id="product"
            onMouseEnter={handleProductMouseEnter}
            onMouseLeave={handleProductMouseLeave}
          >
            Product
            <i className="fa-solid fa-chevron-down"></i>{" "}
          </a>
          <div
            className={`${styles["list-product"]} ${productList}`}
            id="listProduct"
            onMouseEnter={handleProductMouseEnter}
            onMouseLeave={handleProductMouseLeave}
          >
            <a href="">Tất cả sản phẩm</a>

            <a href="">Thuốc theo đơn</a>

            <a href="">Thuốc không theo đơn</a>

            <a href="">Thực phẩm chức năng</a>

            <a href="">Sản phẩm bán chạy</a>
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles["find-product"]}
              required
              placeholder="Tìm tên thuốc"
              onFocus={handleSetIsFocusTrue}
              onBlur={handleSetIsFocusFalse}
              onClick={handleSetIsFocusTrue}
              value={valueOfFind}
              onChange={(e) => handleSetValueOfFind(e.target.value)}
            />
            {isFocus && rawData && (
              <section className={styles.productsList}>
                {productsData

                  .filter((product) =>
                    product.ProductName.toLowerCase().includes(valueOfFind)
                  )

                  .map((item) => (
                    <div
                      className={styles.productItem}
                      onMouseDown={() => toDetailProduct(Number(item.SKU))}
                    >
                      <div className={styles.image}>
                        <img src={item.ImageURL} alt="" />
                      </div>

                      <div className={styles.description}>
                        <p className={styles.productName}>
                          {" "}
                          {item.ProductName}
                        </p>

                        <br />

                        <p className={styles.cost}> {item.Price}</p>
                      </div>
                    </div>
                  ))}
              </section>
            )}
          </div>
          <button className={styles["btnLogin-popup"]} onClick={loginPageLink}>
            Login
          </button>{" "}
          <button
            className={styles["btnShoppingCart"]}
            onClick={toShoppingCart}
          >
            {" "}
            <i className="fa-solid fa-cart-shopping"></i> Giỏ hàng{" "}
            <div className={styles.countProduct}>{ProductList.length}</div>
          </button>
          <button
            className={styles.customerIcon}
            onClick={() => (window.location.href = "/customer/info")}
          >
            <i className="fa-regular fa-user"></i>
          </button>
        </nav>
      </header>
    </>
  );
};
