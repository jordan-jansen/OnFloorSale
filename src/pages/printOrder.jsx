import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";

// Fallback: random 12-digit number
function makeRandom12() {
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Fallback: 12-digit timestamp YYMMDDHHMMSS
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

export default function PrintOrder() {
  const navigate = useNavigate();
  const {
    items,
    store,
    username,
    customerMobile,

    // new values we’ll set in Cart.jsx
    orderTotal,
    orderRefNo,
    orderBarcode,
  } = useCart();

  const now = new Date();
  const foNo = "1212";
  const mobNo = customerMobile || "N/A";
  const storeCode = store || "N/A";

  // Use values from context if available, otherwise fall back
  const refNo = orderRefNo || makeRandom12();
  const barcode = orderBarcode || makeTimestampBarcode(now);

  const amountFromItems = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const amount = orderTotal || amountFromItems;

  const currency = items[0]?.currency || "AED";

  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function backHome() {
    navigate("/product");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white border rounded-lg shadow-sm p-6 w-[380px]">
        <h2 className="text-center font-semibold mb-4">
          Grandiose Floor Order Print
        </h2>

        <hr className="mb-3" />

        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span>
              <span className="font-medium">FO No</span> {foNo}
            </span>
            <span>
              <span className="font-medium">Date</span> {dateStr}
            </span>
          </div>

          <div className="flex justify-between mb-1">
            <span>
              <span className="font-medium">Mob No</span> {mobNo}
            </span>
            <span>
              <span className="font-medium">Time</span> {timeStr}
            </span>
          </div>

          <div className="flex justify-between mb-1">
            <span>
              <span className="font-medium">Ref No</span> {refNo}
            </span>
            <span>
              <span className="font-medium">Store</span> {storeCode}
            </span>
          </div>

          {/* Optional: show username */}
          {username && (
            <div className="mt-1">
              <span className="font-medium">User</span> {username}
            </div>
          )}

          <div className="mt-1">
            <span className="font-medium">Amount</span>{" "}
            {currency} {amount.toFixed(2)}
          </div>
        </div>

        {/* Barcode box */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex flex-col items-center">
            <div className="w-52 h-20 border bg-gray-50 flex items-center justify-center text-xs">
              (Barcode for Ref {refNo})
            </div>
            <div className="mt-1 text-xs tracking-[0.2em]">
              {barcode}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={backHome}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
