import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";
import { useState } from "react";

export default function Cart() {
  const {
    items,
    clearCart,
    addOrder,          // from cartContext
    setOrderTotal,
    setOrderRefNo,
    setOrderBarcode,
    store,
    customerMobile,
    username,
  } = useCart();

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Subtotal from items
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  // VAT (5%)
  const vat = subtotal * 0.05;
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
    const createdAtISO = now.toISOString();
    const refNo = makeRandom12();
    const barcode = makeTimestampBarcode(now);

    // Save for PrintOrder page
    setOrderTotal(total);
    setOrderRefNo(refNo);
    setOrderBarcode(barcode);

    try {
      // Send to backend API
      const response = await fetch("http://localhost:5181/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: crypto.randomUUID(),
          storeId: store || "1W7",
          createdAt: createdAtISO,
          refNo,
          barcode,
          customerMobile,
          username,
          items: items.map((i) => ({
            barcode: i.barcode,
            itemNo: i.name,
            description: i.description,
            unitPriceIncVAT: Number(i.price || 0),
            quantity: i.quantity,
          })),
          totals: {
            subtotal,
            vat,
            total,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("API returned non-OK status");
      }

      // Save snapshot into local history for todaysOrders.jsx
      addOrder({
        id: crypto.randomUUID(),
        createdAt: createdAtISO,
        refNo,
        barcode,
        store: store || "",
        customerMobile: customerMobile || "",
        username: username || "",
        subtotal,
        vat,
        total,
        itemCount: items.length,
        items: items,
      });

      clearCart();
      navigate("/print-order");
    } catch (err) {
      console.error(err);
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
              <th className="py-1 px-2 border-b text-left">Name</th>
              <th className="py-1 px-2 border-b text-right">Price</th>
              <th className="py-1 px-2 border-b text-right">Qty</th>
              <th className="py-1 px-2 border-b text-left">Barcode</th>
              <th className="py-1 px-2 border-b text-right">Total</th>
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
              items.map((item) => {
                const lineTotal =
                  Number(item.price || 0) * (item.quantity || 1);

                return (
                  <tr
                    key={item.lineId || item.barcode || item.name}
                  >
                    <td className="py-1 px-2 border-b">
                      {item.name || item.description || "Item"}
                    </td>
                    <td className="py-1 px-2 border-b text-right">
                      {Number(item.price || 0).toFixed(2)} AED
                    </td>
                    <td className="py-1 px-2 border-b text-right">
                      {item.quantity ?? 1}
                    </td>
                    <td className="py-1 px-2 border-b">
                      {item.barcode || "-"}
                    </td>
                    <td className="py-1 px-2 border-b text-right">
                      {lineTotal.toFixed(2)} AED
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="mt-4 text-sm">
          <p>Subtotal: {subtotal.toFixed(2)} AED</p>
          <p>VAT (5%): {vat.toFixed(2)} AED</p>
          <p className="font-bold">Total: {total.toFixed(2)} AED</p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={goBack}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Order
          </button>
        </div>

        {showAlert && (
          <div className="mt-4 p-3 border rounded bg-red-50 text-sm">
            <p className="mb-2">{alertMessage}</p>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setShowAlert(false)}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
