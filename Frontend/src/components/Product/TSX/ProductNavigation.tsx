import { useState } from "react";
import styles from "../CSS/ProductNavigation.module.css";

export const ProductNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (
    index: number,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    setActiveTab(index);
  };

  const tabs = ["Tất cả sản phẩm", "Thuốc theo đơn", "Thuốc không theo đơn"];

  return (
    <>
      <section className={styles.hero}>
        <nav className={styles["category-tabs"]}>
          {tabs.map((tab, index) => (
            <a
              key={index}
              href="#"
              className={`${styles.tab} ${
                activeTab === index ? styles.active : ""
              }`}
              onClick={(e) => {
                handleTabClick(index, e);
                window.location.href = `#${tab
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`;
              }}
            >
              {tab}
            </a>
          ))}
        </nav>
      </section>
    </>
  );
};
