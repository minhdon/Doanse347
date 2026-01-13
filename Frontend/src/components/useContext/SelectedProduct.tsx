import { createContext, useState, type ReactNode } from "react";
import type { ApiData } from "../CallApi/CallApiProduct";

export type SelectedProductType = {
  selectedProduct: ApiData | null;
  ChangeSelectedProduct: (newIndex: ApiData) => void;
};

const SelectedProductContext = createContext<SelectedProductType>({
  selectedProduct: null,
  ChangeSelectedProduct: () => {},
});

type SelectedProductProviderProps = {
  children: ReactNode;
};

function SelectedProductProvider({ children }: SelectedProductProviderProps) {
  const [selectedProduct, setSelectedProduct] = useState<ApiData | null>(null);

  const ChangeSelectedProduct = (firstIndex: ApiData) => {
    setSelectedProduct(firstIndex);
  };

  const value = {
    selectedProduct,
    ChangeSelectedProduct,
  };

  return (
    <SelectedProductContext.Provider value={value}>
      {children}
    </SelectedProductContext.Provider>
  );
}

export { SelectedProductContext, SelectedProductProvider };
