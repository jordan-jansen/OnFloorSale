import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";
import { useState } from "react";

export default function Cart() {
  const {
    items,
    clearCart,
    setOrderTotal,
    setOrderRefNo,
    setOrderBarcode,
  } = useCart();

  const navigate = useNavigate();
  console.log(items);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // if you have VAT, you can include it like this:
  const vat = subtotal * 0.05;           // change if your VAT is different
  const total = subtotal + vat;

  function goBack() {
    navigate("/product");
  }

  // 🔹 random 12-digit number
  function makeRandom12() {
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  // 🔹 12-digit timestamp: YYMMDDHHMMSS
  function makeTimestampBarcode(date = new Date()) {
    const pad2 = (n) => n.toString().padStart(2, "0");

    const yy = date.getFullYear().toString().slice(-2);
    const mm = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const hh = pad2(date.getHours());
    const mi = pad2(date.getMinutes());
    const ss = pad2(date.getSeconds());

    return `${yy}${mm}${dd}${hh}${mi}${ss}`;
  }

  async function handleConfirm() {
    if (items.length === 0) {
      setAlertMessage("Cart is empty.");
      setShowAlert(true);
      return;
    }

    const now = new Date();
    const refNo = makeRandom12();
    const barcode = makeTimestampBarcode(now);

    // 👉 save in context so PrintOrder can read it
    setOrderTotal(total);
    setOrderRefNo(refNo);
    setOrderBarcode(barcode);

    try {
      // keep your API call here (adjust to your real payload)
      await fetch("http://localhost:5181/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: crypto.randomUUID(),
          storeId: "1W7",
          createdAt: now.toISOString(),
          refNo,
          barcode,
          items: items.map((i) => ({
            barcode: i.barcode,
            itemNo: i.name,
            description: i.description,
            unitPriceIncVAT: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      clearCart();           // clear the cart lines
      navigate("/print-order");
    } catch (err) {
      console.error(err);
      setAlertMessage("Failed to confirm order.");
      setShowAlert(true);
    }
  }

  // 🔻 keep your existing JSX (table, buttons, etc), just make sure:
  // - "Confirm Order" button calls handleConfirm
  // - "Back" button calls goBack
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




