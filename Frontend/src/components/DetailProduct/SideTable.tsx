import React, { useState, useContext } from "react";
import styles from "./SideTable.module.css";
import { SelectedProductContext } from "../useContext/SelectedProduct";

// Định nghĩa kiểu dữ liệu cho menu
interface SectionData {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface DrugInfo {
  cachDung: string;
  lieuDung: string;
  lieuDungTreEm: string;
  luuY: string;
  quaLieu: string;
  trieuChung: string;
  quenLieu: string;
}

const SideTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("thanh-phan");
  const productContext = useContext(SelectedProductContext);
  const product = productContext.selectedProduct;

  const getCapitalizedWords = (text: string): string => {
    // Hàm lấy các từ bắt đầu bằng chữ hoa để lấy tên thuốc
    if (!text) return "";

    const words = text.trim().split(/\s+/);

    const wordChoices = words.slice(1).filter((word) => {
      const firstChar = word.charAt(0);
      return firstChar !== firstChar.toLowerCase();
    });
    return wordChoices.join(" ");
  };
  const splitByFirstColon = (text: string) => {
    const index = text.indexOf(":");

    // Nếu không tìm thấy dấu : thì trả về nguyên chuỗi và rỗng
    if (index === -1) {
      return { before: text, after: "" };
    }

    const before = text.slice(0, index).trim();
    const after = text.slice(index + 1).trim(); // index + 1 để bỏ qua chính dấu :

    return { before, after };
  };
  const { before, after } = product?.Uses
    ? splitByFirstColon(product.Uses)
    : { before: "", after: "" };

  const extractSection = (
    text: string,
    startPatterns: string[],
    endPatterns: string[]
  ): string => {
    // Tạo Regex tìm điểm bắt đầu (case-insensitive)
    // Ví dụ: Tìm "Cách dùng" hoặc "Cách dùng:"
    const startRegex = new RegExp(`(${startPatterns.join("|")})[:?]?\\s*`, "i");
    const startMatch = text.match(startRegex);

    if (!startMatch || startMatch.index === undefined) return "";

    // Vị trí bắt đầu lấy nội dung (sau từ khóa header)
    const startIndex = startMatch.index + startMatch[0].length;
    const contentAfterStart = text.slice(startIndex);

    // Tìm vị trí của header kế tiếp gần nhất
    // Chúng ta tìm bất kỳ từ khóa nào trong danh sách endPatterns
    let minEndIndex = contentAfterStart.length;

    endPatterns.forEach((pattern) => {
      // Regex tìm header kế tiếp, đảm bảo nó nằm ở đầu dòng hoặc sau dấu chấm/xuống dòng để tránh trùng lặp giữa câu
      const endRegex = new RegExp(
        `(?:^|\\n|\\.|\\?)\\s*(${pattern})[:?]?`,
        "i"
      );
      const match = contentAfterStart.match(endRegex);
      if (match && match.index !== undefined && match.index < minEndIndex) {
        minEndIndex = match.index;
      }
    });

    // Cắt chuỗi và loại bỏ khoảng trắng thừa
    return contentAfterStart.slice(0, minEndIndex).trim();
  };

  const parseDrugInfo = (rawText: string): DrugInfo => {
    // Chuẩn hóa văn bản đầu vào: Xóa khoảng trắng thừa kép, chuyển về dạng chuẩn
    const cleanText = rawText.replace(/\r\n/g, "\n");

    // Danh sách các từ khóa dùng để định vị (Markers)
    const markers = {
      cachDung: ["Cách dùng", "Hướng dẫn sử dụng"],
      lieuDung: ["Liều dùng", "Liều lượng"],
      treEm: ["Trẻ em", "Liều dùng cho trẻ em"],
      luuY: ["Lưu ý", "Thận trọng"],
      quaLieu: ["Làm gì khi dùng quá liều", "Quá liều"],
      trieuChung: ["Triệu chứng"],
      dieuTri: ["Điều trị"], // Dùng làm điểm chặn cho Triệu chứng
      quenLieu: [
        "Làm gì khi quên 1 liều",
        "Làm gì khi quên một liều",
        "Quên liều",
        "Làm gì khi thiếu một liều",
      ],
    };

    return {
      // 1. Cách dùng: Lấy từ "Cách dùng" đến "Liều dùng"
      cachDung: extractSection(cleanText, markers.cachDung, [
        ...markers.lieuDung,
        ...markers.quaLieu,
      ]),

      // 2. Liều dùng: Lấy từ "Liều dùng" đến "Lưu ý" hoặc "Quá liều"
      lieuDung: extractSection(cleanText, markers.lieuDung, [
        ...markers.luuY,
        ...markers.quaLieu,
      ]),

      // 3. Liều dùng trẻ em: Tìm dòng chứ "Trẻ em" nằm trong bối cảnh chung (thường nằm trong Liều dùng)
      // Lưu ý: Logic này trích xuất dòng cụ thể bắt đầu bằng "Trẻ em:"
      lieuDungTreEm: (() => {
        const regex = /Trẻ em:\s*(.*?)(\n|$|\.)/i;
        const match = cleanText.match(regex);
        return match ? match[1].trim() : "";
      })(),

      // 4. Lưu ý: Từ "Lưu ý" đến "Quá liều"
      luuY: extractSection(cleanText, markers.luuY, [
        ...markers.quaLieu,
        ...markers.quenLieu,
      ]),

      // 5. Quá liều: Từ "Quá liều" đến "Triệu chứng" hoặc "Quên liều"
      // (Nếu bạn muốn Quá liều bao gồm cả triệu chứng, bỏ 'markers.trieuChung' ra khỏi endPatterns)
      quaLieu: extractSection(cleanText, markers.quaLieu, [
        ...markers.trieuChung,
        ...markers.dieuTri,
        ...markers.quenLieu,
      ]),

      // 6. Triệu chứng: Từ "Triệu chứng" đến "Điều trị" hoặc "Quên liều"
      trieuChung: extractSection(cleanText, markers.trieuChung, [
        ...markers.dieuTri,
        ...markers.quenLieu,
      ]),

      // 7. Quên liều: Từ "Quên liều" đến hết văn bản (không có endPattern)
      quenLieu: extractSection(cleanText, markers.quenLieu, []), // [] nghĩa là lấy đến hết bài
    };
  };

  const result = parseDrugInfo(product?.HowToUse || "");

  // Hàm xử lý khi click menu: Scroll đến section và set active
  const handleScrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dữ liệu mock giống trong hình ảnh của bạn
  const sections: SectionData[] = [
    {
      id: "thanh-phan",
      label: "Thành phần",
      content: (
        <>
          <p className={styles.text}>
            Thành phần cho 1{" "}
            {product?.Unit ? product.Unit.toLocaleLowerCase() : ""}
          </p>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Thông tin thành phần</th>
                {/* <th>Hàm lượng</th> */}
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tableRow}>
                <td>{product?.Ingredient}</td>
                {/* <td style={{ textAlign: "right" }}>500mg</td> */}
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      id: "cong-dung",
      label: "Công dụng",
      content: (
        <>
          <div className={styles.subTitle}>Chỉ định</div>
          <p className={styles.text}>{before} :</p>
          <p className={styles.text}>{after}</p>
        </>
      ),
    },
    {
      id: "cach-dung",
      label: "Cách dùng",
      content: (
        <div>
          <div className={styles.subTitle}>Cách dùng</div>
          <p className={styles.text}>
            {result.cachDung || "Thông tin đang cập nhật..."}
          </p>

          <div className={styles.subTitle}>Liều dùng</div>
          <p className={styles.text}>
            {result.lieuDung || "Thông tin đang cập nhật..."}
          </p>

          <div className={styles.subTitle}>Trẻ em</div>
          <p className={styles.text}>
            {result.lieuDungTreEm || "Thông tin đang cập nhật..."}
          </p>

          <div className={styles.subTitle}> Dùng thuốc quá liều?</div>

          <p className={styles.text}>
            {result.quaLieu || "Thông tin đang cập nhật..."}
          </p>

          <div className={styles.subTitle}> Dùng thuốc thiếu liều?</div>

          <p className={styles.text}>
            {result.quenLieu || "Thông tin đang cập nhật..."}
          </p>
        </div>
      ),
    },
    {
      id: "tac-dung-phu",
      label: "Tác dụng phụ",
      content: (
        <p className={styles.text}>
          {product?.SideEffect || "Thông tin đang cập nhật..."}
        </p>
      ),
    },
    {
      id: "luu-y",
      label: "Lưu ý",
      content: (
        <p className={styles.text}>
          {result.luuY || "Thông tin đang cập nhật..."}
        </p>
      ),
    },
    {
      id: "bao-quan",
      label: "Bảo quản",
      content: (
        <p className={styles.text}>
          {product?.Preserve || "Thông tin đang cập nhật..."}
        </p>
      ),
    },
  ];

  console.log(product?.Preserve);

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <ul className={styles.menuList}>
          {sections.map((sec) => (
            <li
              key={sec.id}
              className={`${styles.menuItem} ${
                activeTab === sec.id ? styles.active : ""
              }`}
              onClick={() => handleScrollTo(sec.id)}
            >
              {sec.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.titleMain}>
            {getCapitalizedWords(product?.ProductName as string)} là gì?
          </h1>
        </div>

        {sections.map((sec) => (
          <section key={sec.id} id={sec.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {sec.id === "thanh-phan"
                ? `Thành phần của ${getCapitalizedWords(
                    product?.ProductName as string
                  )}`
                : `${sec.label} của ${getCapitalizedWords(
                    product?.ProductName as string
                  )}`}
            </h2>
            {sec.content}
            <hr
              style={{
                border: "none",
                borderBottom: "1px solid #eee",
                margin: "30px 0",
              }}
            />
          </section>
        ))}
      </main>
    </div>
  );
};

export default SideTable;
