import React from "react";
import { Header } from "../../components/HeaderFooter/TSX/Header";

import { Footer } from "../../components/HeaderFooter/TSX/Footer";
import { PageContainer } from "../../components/Animation/PageContainer";
import HeroSection from "../../components/LandingPage/HeroSection/HeroSection";
import CommitmentSection from "../../components/LandingPage/CommitmentSection/CommitmentSection";
import ActivitiesSection from "../../components/LandingPage/ActivitiesSection/ActivitiesSection";
import CertificationSection from "../../components/LandingPage/CertificationSection/CertificationSection";
import FeedbackSection from "../../components/LandingPage/FeedbackSection/FeedbackSection";
import ProductsSection from "../../components/LandingPage/ProductsSection/ProductsSection";
function LandingPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <HeroSection />
        <ProductsSection />
        <CommitmentSection />
        <ActivitiesSection />
        <CertificationSection />
        <FeedbackSection />
      </PageContainer>
      <Footer />
    </>
  );
}

export default LandingPage;
