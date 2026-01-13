import React, { useEffect, useMemo, useState, useContext } from "react";
import styles from "./DetailProduct.module.css";
import { useSearchParams } from "react-router";

import { useProductFetcher, type ApiData } from "../CallApi/CallApiProduct";
import type { IProduct } from "../../types/product";
import { SelectedProductContext } from "../useContext/SelectedProduct";

interface CartItem extends IProduct {
  quantity: number;
}

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CheckShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1d48ba"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const TruckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1d48ba"
    strokeWidth="2"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const LightningIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ProductDetail: React.FC = () => {
  const { data } = useProductFetcher();
  const [allProducts, setAllProducts] = useState<ApiData[]>([]);
  const [search] = useSearchParams();
  const productID = search.get("productId");
  const productContext = useContext(SelectedProductContext);
  useEffect(() => {
    if (data) {
      setAllProducts(data);
    }
  }, [data]);

  const selectedProduct = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    return allProducts.find((item) => Number(item.SKU) == Number(productID));
  }, [allProducts, productID]);
  productContext.ChangeSelectedProduct(selectedProduct as ApiData);
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

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        {/* Cột trái: Hình ảnh */}
        <div className={styles.leftColumn}>
          <div className={styles.mainImageContainer}>
            <img
              src={selectedProduct?.ImageURL}
              alt="Orihiro Fish Oil"
              className={styles.mainImage}
            />
            <img
              src={selectedProduct?.ImageURL}
              alt="Chính hãng"
              className={styles.badge}
            />
          </div>
          <div className={styles.gallery}>
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className={`${styles.galleryItem} ${
                  index === 0 ? styles.active : ""
                }`}
              >
                <img
                  src={selectedProduct?.ImageURL}
                  alt="Thumbnail"
                  className={styles.galleryImg}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Thông tin */}
        <div className={styles.rightColumn}>
          <div className={styles.brand}>{selectedProduct?.Brand}</div>
          <h1 className={styles.title}>{selectedProduct?.ProductName}</h1>

          <div className={styles.metaInfo}>
            <span className={styles.sku}>{selectedProduct?.SKU}</span>
            <div className={styles.rating}>
              <span>4.9</span>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </div>
            <span className={styles.link}>49 đánh giá</span>
            <span className={styles.link}>431 bình luận</span>
          </div>
          {/* 
          <div className={styles.flashSaleBanner}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src="https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/sm_flash_sale_1_252ec4285b.png"
                alt="icon"
                height="20"
              />
              <span>Flashsale GIÁ TỐT</span>
            </div>
            <div className={styles.timer}>
              <span>Kết thúc sau</span>
              <span className={styles.timerBox}>08</span>:
              <span className={styles.timerBox}>08</span>:
              <span className={styles.timerBox}>31</span>
            </div>
          </div> */}

          <div className={styles.priceContainer}>
            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>
                {selectedProduct?.Price}
              </span>
              <span className={styles.unit}>/ {selectedProduct?.Unit}</span>
            </div>

            {/* <p style={{ fontSize: "12px", color: "#1d48ba", marginTop: "5px" }}>
              Lưu ý: Flash sale giá sốc chỉ áp dụng với số lượng & thời gian
              giới hạn <span className={styles.link}>xem chi tiết </span>
            </p> */}
          </div>

          <div className={styles.specsContainer}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Đơn vị tính</span>
              <div className={styles.unitTag}>{selectedProduct?.Unit}</div>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}></span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Xuất xứ thương hiệu</span>
              <span className={styles.specValue}>
                {selectedProduct?.Manufacturer}
              </span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Nhà sản xuất</span>
              <span className={styles.specValue}>{selectedProduct?.Brand}</span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Nước sản xuất</span>
              <span className={styles.specValue}>
                {selectedProduct?.Manufacturer}
              </span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Thành phần</span>
              <span className={styles.specValue}>
                {selectedProduct?.Ingredient}
              </span>
            </div>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Mô tả</span>
              <span className={styles.specValue}>
                {selectedProduct?.Description}
              </span>
            </div>
          </div>

          {/* Khuyến mãi */}
          <div className={styles.promoBox}>
            <div className={styles.promoTitle}>
              <span
                style={{
                  background: "#f39c12",
                  color: "white",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "inline-flex",
                  justifyContent: "center",
                  fontSize: "10px",
                  alignItems: "center",
                }}
              >
                %
              </span>
              Khuyến mại được áp dụng
            </div>
            <div className={styles.promoItem}>
              <input
                type="radio"
                name="promo"
                defaultChecked
                className={styles.promoRadio}
              />
              <div>
                <span style={{ fontWeight: "bold" }}>
                  Giảm ngay 72,000đ áp dụng đến 31/12
                </span>
              </div>
            </div>
            <div className={styles.promoItem}>
              <input type="radio" name="promo" className={styles.promoRadio} />
              <div>
                <span style={{ fontWeight: "bold" }}>
                  Giảm ngay 20% khi mua Online 8h - 22h áp dụng đến 01/12
                </span>
              </div>
            </div>
          </div>

          {/* <div className={styles.specRow} style={{ alignItems: "center" }}>
            <span className={styles.specLabel}>Chọn số lượng</span>
            <div className={styles.quantitySelector}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                className={styles.qtyInput}
                value={quantity}
                readOnly
              />
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div> */}

          <div className={styles.buttonGroup}>
            <button
              className={styles.btnBuy}
              onClick={() => {
                if (selectedProduct) {
                  handleAddToCart(selectedProduct);
                }
              }}
            >
              Chọn mua
            </button>
            <button className={styles.btnFindStore}>Tìm nhà thuốc</button>
          </div>

          <div className={styles.highlightText}>
            <LightningIcon /> Sản phẩm đang được chú ý,{" "}
            <span style={{ color: "#333" }}>
              có 20 người thêm vào giỏ hàng & 14 người đang xem
            </span>
          </div>

          <div className={styles.footerBadges}>
            <div className={styles.badgeItem}>
              <CheckShieldIcon />
              <div>
                <div style={{ fontWeight: 600 }}>Đổi trả trong 30 ngày</div>
                <div style={{ color: "#777", fontSize: "11px" }}>
                  kể từ ngày mua hàng
                </div>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <CheckShieldIcon />
              <div>
                <div style={{ fontWeight: 600 }}>Miễn phí 100%</div>
                <div style={{ color: "#777", fontSize: "11px" }}>đổi thuốc</div>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <TruckIcon />
              <div>
                <div style={{ fontWeight: 600 }}>Miễn phí vận chuyển</div>
                <div style={{ color: "#777", fontSize: "11px" }}>
                  theo chính sách giao hàng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
