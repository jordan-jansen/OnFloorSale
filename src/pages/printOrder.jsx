import { useNavigate } from "react-router-dom";
import { useCart } from "../cartContext.jsx";
import Barcode from "react-barcode";

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
  const barcode = orderBarcode || makeTimestampBarcode(now); // 👈 this is what we encode

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
    navigate("/fo-start");
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

        {/* 👇 Actual barcode using react-barcode */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex flex-col items-center">
             <Barcode
            value={String(barcode || refNo || "000000000000")} // make sure it’s a string
            displayValue={true}   // show the number under the bars
            fontSize={12}
            height={60}
            width={1.5}
          />
            <div className="mt-1 text-xs">
              Ref: {refNo}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={backHome}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
