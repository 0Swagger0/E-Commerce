import { React } from "react";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./MyComponent/Home";

//navigation bar
import HeaderToolbar from "./MyComponent/HeaderToolbar";
//navigation pages
import HomeAndKitchen from "./NavigationPages/HomeAndKitchen";
import Electronics from "./NavigationPages/Electronics";
import Mobiles from "./NavigationPages/Mobiles";
import BeautyAndKids from "./NavigationPages/BeautyAndKids";
import Cart from "./MyComponent/Cart";
import Wishlist from "./MyComponent/Wishlist";
import { Container } from "@mui/system";
import Profile from "./MyComponent/Profile";
import MyOrders from "./MyComponent/MyOrders";
import OrderConfirm from "./MyComponent/OrderConfirm";

function App() {
  return (
    <div>
      <HeaderToolbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/home-and-kitchen" element={<HomeAndKitchen />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/beauty-and-kids" element={<BeautyAndKids />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order-confirm" element={<OrderConfirm />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
