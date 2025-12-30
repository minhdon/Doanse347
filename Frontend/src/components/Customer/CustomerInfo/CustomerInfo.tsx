import React from "react";
import styles from "./CustomerInfo.module.css";

// --- Icons (SVG Inline components để không cần cài thư viện) ---
const UserIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// --- Component Chính ---

const CustomerInfo: React.FC = () => {
  // Dữ liệu mẫu (Giống trong hình)
  const customerData = {
    name: "Nguyễn Văn A",
    address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    phone: "0901 234 567",
    email: "nguyenvana@email.com",
    dob: "15/03/1990",
  };
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Thông tin khách hàng</h1>
        {isEditing == false && (
          <button
            className={styles.editButton}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <EditIcon />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Card Thông tin */}
      <div className={styles.card}>
        {/* Avatar ở giữa */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>
              <i className="fa-regular fa-user"></i>
            </div>
          </div>
        </div>

        {/* Danh sách các trường thông tin */}

        {/* Họ và tên */}
        <div className={styles.infoRow}>
          <div className={styles.iconWrapper}>
            <UserIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.label}>Họ và tên</span>
            <span className={styles.value}>{customerData.name}</span>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className={styles.infoRow}>
          <div className={styles.iconWrapper}>
            <MapPinIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.label}>Địa chỉ</span>
            <span className={styles.value}>{customerData.address}</span>
          </div>
        </div>

        {/* Số điện thoại */}
        <div className={styles.infoRow}>
          <div className={styles.iconWrapper}>
            <PhoneIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.label}>Số điện thoại</span>
            <span className={styles.value}>{customerData.phone}</span>
          </div>
        </div>

        {/* Email */}
        <div className={styles.infoRow}>
          <div className={styles.iconWrapper}>
            <MailIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{customerData.email}</span>
          </div>
        </div>

        {/* Ngày sinh */}
        <div className={styles.infoRow}>
          <div className={styles.iconWrapper}>
            <CalendarIcon />
          </div>
          <div className={styles.infoContent}>
            <span className={styles.label}>Ngày sinh</span>
            <span className={styles.value}>{customerData.dob}</span>
          </div>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        {/* Nút chính: Xác nhận (Nằm trên) */}
        {isEditing && (
          <button
            className={styles.confirmButton}
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Xác nhận
          </button>
        )}

        {/* Nút phụ: Quay về (Nằm dưới) */}
        {isEditing == false && (
          <button
            className={styles.backButton}
            onClick={() => (window.location.href = "/")}
          >
            Quay về trang chủ
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
