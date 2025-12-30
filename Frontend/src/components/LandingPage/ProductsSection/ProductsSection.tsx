import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ProductsSection.module.css";
import { type ApiData } from "../../CallApi/CallApiProduct";
import { useNavigate, createSearchParams } from "react-router";

const ProductsSection = () => {
  const rawData = localStorage.getItem("products");
  const productsData = rawData ? JSON.parse(rawData) : [];
  const top8Items = productsData.slice(0, 8);
  console.log("Top 8 products:", top8Items);
  const navigate = useNavigate();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    slidesToScroll: 1,
    align: "start",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const toDetailProduct = (id: number) => {
    navigate({
      pathname: "/DetailProduct",
      search: createSearchParams({ productId: id.toString() }).toString(),
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sản Phẩm Nổi Bật</h2>
          <p className={styles.subtitle}>
            Các sản phẩm được khách hàng tin dùng và đánh giá cao
          </p>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft size={24} className={styles.navIcon} />
          </button>

          <div className={styles.carousel} ref={emblaRef}>
            <div className={styles.carouselContainer}>
              {top8Items.map((product: ApiData) => (
                <div key={product.id} className={styles.slide}>
                  <div className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.img}
                        alt=""
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#f9f9f9",
                        }}
                      />
                      {/* <Pill size={48} color="#0066CC" /> */}
                      {/* {product.badge && (
                        <span className={styles.badge}>{product.badge}</span>
                      )} */}
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>
                        {product.productName}
                      </h3>
                      <p className={styles.productPrice}>
                        {" "}
                        {new Intl.NumberFormat("vi-VN").format(product.cost)}đ
                      </p>
                      <button
                        className={styles.viewBtn}
                        onClick={() => toDetailProduct(product.id)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight size={24} className={styles.navIcon} />
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: Math.ceil(top8Items.length / 4) }).map(
            (_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  selectedIndex === index ? styles.dotActive : ""
                }`}
                onClick={() => scrollTo(index)}
              />
            )
          )}
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => {
            window.location.href = "/product";
          }}
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
