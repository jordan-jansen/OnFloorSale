import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";
import { useState } from "react";

export default function Cart() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
 console.log(items);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  function goBack() {
    navigate("/product");
  }

  async function handleConfirm() {
    if (items.length === 0) {
      setAlertMessage("Cart is empty.");
      setShowAlert(true);
      return;
    }

    try {
      await fetch("http://localhost:5181/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: crypto.randomUUID(),
          storeId: "1W7",
          createdAt: new Date().toISOString(),
          items: items.map((i) => ({
            barcode: i.barcode,
            itemNo: i.name,
            description: i.description,
            unitPriceIncVAT: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      clearCart();
      navigate("/print-order");
    } catch (err) {
      setAlertMessage("Failed to confirm order.");
      setShowAlert(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow rounded-lg p-6">

        <h1 className="text-lg font-semibold mb-4">Your Cart</h1>

        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Barcode</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No items
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.price} AED</td>
                  <td>{item.quantity}</td>
                  <td>{item.barcode}</td>
                  <td>
                    {(item.price * item.quantity)} AED
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <p>Subtotal: {subtotal.toFixed(2)} AED</p>
          <p>VAT: {vat.toFixed(2)} AED</p>
          <p className="font-bold">Total: {total.toFixed(2)} AED</p>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={goBack}>Back</button>
          <button onClick={handleConfirm} className="bg-blue-600 text-white">
            Confirm Order
          </button>
        </div>

        {showAlert && (
          <div className="alert">
            <p>{alertMessage}</p>
            <button onClick={() => setShowAlert(false)}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}
