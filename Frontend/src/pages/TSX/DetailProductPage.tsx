import ProductDetail from "../../components/DetailProduct/DetailProduct";
import SideTable from "../../components/DetailProduct/SideTable";
import { Footer } from "../../components/HeaderFooter/TSX/Footer";
import { Header } from "../../components/HeaderFooter/TSX/Header";

function DetailProductPage() {
  return (
    <>
      <Header />
      <ProductDetail />
      <SideTable />
      <Footer />
    </>
  );
}
export default DetailProductPage;
