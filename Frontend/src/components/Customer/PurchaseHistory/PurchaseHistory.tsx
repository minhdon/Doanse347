import { ShoppingBag } from "lucide-react";
import styles from "./PurchaseHistory.module.css";

const PurchaseHistory = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lịch sử mua hàng</h1>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <ShoppingBag size={36} />
        </div>
        <p className={styles.emptyText}>Chưa có lịch sử mua hàng</p>
        <p className={styles.emptySubtext}>
          Các đơn hàng của bạn sẽ hiển thị ở đây
        </p>
      </div>
    </div>
  );
};

export default PurchaseHistory;
