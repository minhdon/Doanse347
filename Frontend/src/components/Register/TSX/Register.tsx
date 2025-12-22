import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from "../CSS/Register.module.css";

export const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [check, setCheck] = useState(false);
  const actionUnHiddenPassword = () => {
    setHiddenPassword(false);
  };
  const actionHiddenPassword = () => {
    setHiddenPassword(true);
  };

  const isValidEmail = (email: string) => {
    // Regex tiêu chuẩn cho email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email) == true) setCheck(true);
    else setCheck(false);
    if (error) setError(null);
    return;
  };
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (
      check == true &&
      passwordData.password == passwordData.passwordConfirm
    ) {
      setSuccess("Đăng nhập thành công");
      window.location.href = "/Login";
    } else {
      if (check == false) setError("Email không hợp lệ");
      if (passwordData.password != passwordData.passwordConfirm)
        setError("Mật khẩu xác nhận không đúng");
    }

    return;
  };
  const handleSetPasswordData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const unHidden = hiddenPassword ? "" : styles.unhidden;
  const Hidden = hiddenPassword ? "" : styles.hidden;
  const typePassword = hiddenPassword ? "password" : "text";
  return (
    <>
      <section className={styles.root}>
        <section className={styles.image}>
          <img src="/images/bgLogin.png" alt="" />
        </section>

        <section className={styles.hero}>
          <div className={styles.logo}>
            <img src="/images/logo.png" alt="" />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <div className={styles.wrapper}>
            <div
              className={`${styles["form-box"]} ${styles.register}`}
              id="register-box"
            >
              <h2>Register</h2>
              <p className={styles["first-p"]}>
                Create your account <a href="/">Medicare</a>
              </p>

              <form className={styles.form} action="">
                <div className={styles["input-box"]}>
                  <span className={styles.icon}>
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="text"
                    required
                    id="email-res"
                    onChange={(e) => isValidEmail(e.target.value)}
                  />

                  <label htmlFor="email-res">Email</label>
                </div>

                <div className={styles["input-box"]}>
                  <span className={styles.icon}>
                    <i
                      className={`fa-solid fa-eye ${styles["fa-eye"]} ${unHidden}`}
                      id="eye"
                      onClick={actionHiddenPassword}
                    ></i>

                    <i
                      className={`fa-solid fa-eye-slash ${styles["fa-eye-slash"]} ${Hidden}  `}
                      id="eye-slash"
                      onClick={actionUnHiddenPassword}
                    ></i>
                  </span>

                  <input
                    type={typePassword}
                    id="password-res"
                    required
                    name="password"
                    value={passwordData.password}
                    onChange={handleSetPasswordData}
                  />
                  <label htmlFor="password-res">Password</label>
                </div>

                <div className={styles["input-box"]}>
                  <span className={styles.icon}>
                    <i
                      className={`fa-solid fa-eye ${styles["fa-eye"]} ${unHidden}`}
                      id="eye"
                      onClick={actionHiddenPassword}
                    ></i>

                    <i
                      className={`fa-solid fa-eye-slash ${styles["fa-eye-slash"]} ${Hidden}  `}
                      id="eye-slash"
                      onClick={actionUnHiddenPassword}
                    ></i>
                  </span>

                  <input
                    type={typePassword}
                    id="confirm-password-res"
                    required
                    name="passwordConfirm"
                    value={passwordData.passwordConfirm}
                    onChange={handleSetPasswordData}
                  />
                  <label htmlFor="confirm-password-res">Confirm Password</label>
                </div>

                <div className={styles.agree}>
                  <label htmlFor="agree-checkbox">
                    <input type="checkbox" id="agree-checkbox" />
                    <span>I agree to the terms & conditions</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={styles.btn}
                  id="btnRegister"
                  onClick={handleRegister}
                >
                  Register
                </button>

                <div className={styles["login-register"]}>
                  <p>
                    Already have an account?
                    <a
                      href="/Login"
                      className={styles["login-link"]}
                      id="login-link"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};
