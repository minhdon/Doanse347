import styles from "./Payment.module.css";
import { useContext } from "react";
import { paymentPerProductContext } from "../useContext/PaymentPerProduct";
interface CartItem {
  id: number;
  productName: string;
  cost: number;
  status: boolean;
  img: string;
  productDesc: string;
  quantity: number;
  [key: string]: unknown;
}

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const LightningIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const Payment: React.FC = () => {
  // Dữ liệu giả lập

  const products = useContext(paymentPerProductContext);
  const totalAmount = products.paymentProducts.reduce((total, item) => {
    return total + item.cost * item.quantity;
  }, 0);
  const removeItemByX = (valueA: number): CartItem[] => {
    const STORAGE_KEY = "shoppingCart"; // Thay bằng key của bạn

    try {
      // Lấy dữ liệu
      const storedString = localStorage.getItem(STORAGE_KEY);

      if (storedString) {
        const currentItems: CartItem[] = JSON.parse(storedString);

        // Lọc bỏ các phần tử có x === valueA
        const newItems = currentItems.filter((item) => item.id !== valueA);

        // Lưu ngược lại vào Local Storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));

        // Trả về mảng mới để bạn update State (quan trọng)
        return newItems;
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
    }

    return [];
  };
  // Khi bấm nút xóa

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.freeShipBanner}>
            Miễn phí vận chuyển&nbsp;
            <span style={{ color: "#333" }}>
              đối với đơn hàng trên 300.000đ
            </span>
          </div>

          {/* Header Row */}
          <div className={styles.headerRow}>
            <div className={`${styles.colCheckbox}`}>
              <input
                type="checkbox"
                className={styles.checkbox}
                defaultChecked
              />
            </div>
            <div className={styles.colProduct}>
              Chọn tất cả ({products.paymentProducts.length})
            </div>
            <div className={styles.colPrice}>Giá thành</div>
            <div className={styles.colQty}>Số lượng</div>
            <div className={styles.colUnit}>Đơn vị</div>
            <div className={styles.colDelete}></div>
          </div>

          {/* Product Item Row */}
          {products.paymentProducts.map((item) => (
            <div key={item.id}>
              <div className={styles.cartItem}>
                <div className={styles.colCheckbox}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    defaultChecked
                  />
                </div>

                <div className={`${styles.colProduct} ${styles.productInfo}`}>
                  <img
                    src={item.img}
                    alt="Product"
                    className={styles.productImg}
                  />
                  <div>
                    <span className={styles.flashSaleBadge}>
                      <LightningIcon /> Flash sale giá sốc
                    </span>
                    <div className={styles.productName}>{item.productName}</div>
                  </div>
                </div>

                <div className={styles.colPrice}>
                  <span className={styles.currentPrice}>
                    {(item.cost * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className={styles.colQty}>
                  <div className={styles.qtyGroup}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => products.handleDecreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className={styles.qtyInput}
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className={styles.qtyBtn}
                      onClick={() => products.handleIncreaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.colUnit}>
                  <select className={styles.unitSelect}>
                    <option>Hộp</option>
                    <option>Lọ</option>
                  </select>
                </div>

                <div className={styles.colDelete}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      products.handleDeleteProduct(item.id);
                      removeItemByX(item.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promotion info inside item card */}
          <div className={styles.itemFooter}>
            <div className={styles.lightningIcon}>
              <LightningIcon />
            </div>
            <span>Giảm ngay 20% khi mua Online 8h - 22h áp dụng đến 01/12</span>
          </div>
        </div>
        {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
        <div className={styles.rightPanel}>
          <div className={styles.couponBar}>
            <span>Áp dụng ưu đãi để được giảm giá</span>
            <ChevronRight />
          </div>

          <div className={styles.summaryRow}>
            <span>Tổng tiền</span>
            <span className={styles.summaryVal}>
              {totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Thành tiền</span>
            <div style={{ textAlign: "right" }}>
              <span className={styles.totalPrice}>
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <button className={styles.btnCheckout}>Mua hàng</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
