import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

import { SortProvider } from "./components/useContext/priceSortContext.tsx";
import { IndexProvider } from "./components/useContext/IndexProductContext.tsx";
import { PaymentPerProductProvider } from "./components/useContext/PaymentPerProduct.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <PaymentPerProductProvider>
        <SortProvider>
          <IndexProvider>
            {" "}
            <App />
          </IndexProvider>
        </SortProvider>
      </PaymentPerProductProvider>
    </StrictMode>
  </BrowserRouter>
);
