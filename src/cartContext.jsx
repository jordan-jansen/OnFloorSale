import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const [customerMobile, setCustomerMobile] = useState("");
  const [floorOrder, setFloorOrder] = useState("");
  const [store, setStore] = useState("");
  const [username, setUsername] = useState("");

  function addItem(item) {
    setItems(prev => [
      ...prev,
      { ...item, lineId: crypto.randomUUID() }
    ]);
  }

  function removeItem(lineId) {
    setItems(prev => prev.filter(item => item.lineId !== lineId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,

        store,
        setStore,
        username,
        setUsername,
        customerMobile,
        setCustomerMobile,
        floorOrder,
        setFloorOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
