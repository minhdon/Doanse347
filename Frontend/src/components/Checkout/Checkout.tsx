import React, { useState, useEffect } from "react";
import styles from "./Checkout.module.css";

// ... (Giữ nguyên các phần khai báo Type và Interface ở trên) ...
type PaymentMethod = "momo" | "bank";
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

const Checkout: React.FC = () => {
  const [method, setMethod] = useState<PaymentMethod>("momo");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State quản lý Popup thành công

  // ... (Giữ nguyên logic giỏ hàng và đồng hồ đếm ngược) ...
  const [cartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("shoppingCart");
    return stored ? JSON.parse(stored) : [];
  });

  const totalAmount: number = cartItems.reduce(
    (sum: number, item: CartItem) => {
      const cost = Number(item.cost) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + cost * qty;
    },
    0
  );

  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- LOGIC MỚI ĐƯỢC CẬP NHẬT ---
  const handlePaymentSuccess = () => {
    if (isProcessing || showSuccess) return;

    // 1. Bắt đầu loading
    setIsProcessing(true);

    // 2. Giả lập call API mất 2 giây
    setTimeout(() => {
      setIsProcessing(false); // Tắt loading
      setShowSuccess(true); // Hiện popup thành công
      localStorage.removeItem("shoppingCart"); // Xóa giỏ hàng ngay khi thanh toán thành công

      // 3. Đợi thêm 2 giây hiển thị popup rồi mới chuyển trang
      setTimeout(() => {
        // localStorage.removeItem("shoppingCart"); // Xóa giỏ hàng nếu cần
        window.location.href = "/";
      }, 2000);
    }, 2000);
  };
  // -------------------------------

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thanh toán đơn hàng</h1>

      {/* --- PHẦN POPUP MODAL --- */}
      {showSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.successIcon}>✓</div>
            <h2>Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng.</p>
            <p className={styles.redirectText}>Đang chuyển về trang chủ...</p>
          </div>
        </div>
      )}
      {/* ------------------------ */}

      <div className={styles.layout}>
        {/* Cột Trái */}
        <div className={styles.orderInfo}>
          <h3>Chi tiết đơn hàng</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tổng giá</td>
                <td>{totalAmount.toLocaleString()} đ</td>
              </tr>
              <tr>
                <td>Giảm giá</td>
                <td>0 đ</td>
              </tr>
              <tr className={styles.totalRow}>
                <td>Thành tiền</td>
                <td>{totalAmount.toLocaleString()} đ</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.timerBox}>
            <div>Vui lòng thanh toán trong:</div>
            <span className={styles.timer}>{formatTime(timeLeft)}</span>
            {timeLeft === 0 && (
              <div style={{ color: "red", marginTop: "5px" }}>
                Đã hết thời gian giữ đơn!
              </div>
            )}
          </div>

          <div className={styles.isPayment}>
            <button
              style={{ backgroundColor: "#6c757d" }}
              onClick={() => (window.location.href = "/payment")}
              disabled={isProcessing || showSuccess}
            >
              Quay lại
            </button>
            <button
              onClick={handlePaymentSuccess}
              disabled={isProcessing || showSuccess}
              className={isProcessing ? styles.processingBtn : ""}
            >
              {isProcessing ? (
                <div className={styles.loader}></div>
              ) : (
                "Đã thanh toán"
              )}
            </button>
          </div>
        </div>

        {/* Cột Phải */}
        <div className={styles.paymentSection}>
          {/* ... (Giữ nguyên phần chọn tab và hiển thị QR) ... */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${
                method === "momo" ? styles.active : ""
              }`}
              onClick={() => setMethod("momo")}
            >
              Ví MoMo
            </button>
            <button
              className={`${styles.tabButton} ${
                method === "bank" ? styles.active : ""
              }`}
              onClick={() => setMethod("bank")}
            >
              Ngân hàng
            </button>
          </div>

          <div className={styles.qrContainer}>
            {method === "momo" ? (
              <>
                <img
                  src="/images/momo.png"
                  alt="Momo QR"
                  className={styles.qrImage}
                />
                <div className={styles.instruction}>
                  <p>
                    Mở ứng dụng <strong>MoMo</strong>
                  </p>
                  <p>Chọn "Quét Mã" để thanh toán</p>
                </div>
              </>
            ) : (
              <>
                <img
                  src="/images/bank.png"
                  alt="Bank QR"
                  className={styles.qrImage}
                />
                <div className={styles.instruction}>
                  <p>
                    Mở ứng dụng <strong>Ngân hàng</strong>
                  </p>
                  <p>Sử dụng tính năng QR Pay</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
