import { useState, type FormEvent } from "react";
import styles from "../CSS/ForgotPassword.module.css";

export const ForgotPassword = () => {
  const [check, setCheck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValidEmail = (email: string): boolean => {
    // Regex tiêu chuẩn cho email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };
  const handleSetCheck = (value: string) => {
    if (isValidEmail(value) == true) setCheck(true);
    else setCheck(false);
    return;
  };
  const handleToConfirmOtp = (event: FormEvent) => {
    event.preventDefault();
    if (check === true) window.location.href = "/ConfirmOtp";
    else setError("Email không hợp lệ");
  };
  return (
    <>
      <section className={styles.hero}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles["card-title"]}>Quên Mật Khẩu?</h2>

            <p className={styles["card-description"]}>
              Đừng lo lắng! Chỉ cần nhập email của bạn bên dưới và chúng tôi sẽ
              gửi cho bạn một liên kết để đặt lại mật khẩu.
            </p>

            <form action="#" method="POST">
              <div className={styles["form-group"]}>
                <label htmlFor="email" className={styles["form-label"]}>
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="ban@example.com"
                  className={styles["form-input"]}
                  onChange={(e) => handleSetCheck(e.target.value)}
                />
              </div>

              <div className={styles["button-container"]}>
                <button
                  id="submit-button"
                  className={styles["submit-button"]}
                  onClick={handleToConfirmOtp}
                >
                  Gửi liên kết đặt lại
                </button>
              </div>
            </form>

            <div className={styles["login-link-container"]}>
              <a href="/login" className={styles["login-link"]}>
                Quay lại Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
