import { Routes, Route} from "react-router-dom";

import Login from "./pages/login.jsx";
import Product from "./pages/products.jsx";
import Cart from "./pages/cart.jsx";
import PrintOrder from "./pages/printOrder.jsx";
import FoStart from "./pages/FoStart.jsx";
//import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <Routes>
       {/* <Route path="/admin" element={<Admin/>}/> */}
      <Route path = "/" element={<Login/>}/>
      <Route path = "/product" element={<Product/>}/>
      <Route path = "/cart" element = {<Cart/>}/>
      <Route path = "/print-order" element = {<PrintOrder/>}/>
      <Route path="/fo-start" element={<FoStart/>}/>
    </Routes>
  )
}
