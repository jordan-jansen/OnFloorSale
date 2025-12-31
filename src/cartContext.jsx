import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const [customerMobile, setCustomerMobile] = useState("");
  const [floorOrder, setFloorOrder] = useState("");
  const [store, setStore] = useState("");
  const [username, setUsername] = useState("");

  // 🔹 NEW: data for the last confirmed order
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderRefNo, setOrderRefNo] = useState("");
  const [orderBarcode, setOrderBarcode] = useState("");

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

        customerMobile,
        setCustomerMobile,
        floorOrder,
        setFloorOrder,
        store,
        setStore,
        username,
        setUsername,

        // expose new order fields
        orderTotal,
        setOrderTotal,
        orderRefNo,
        setOrderRefNo,
        orderBarcode,
        setOrderBarcode,
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
