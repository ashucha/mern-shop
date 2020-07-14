import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const cart = useSelector((state) => state.cart);

  return (
    <div>
      <h1>Navbar</h1>
      <p>Cart ({cart.length})</p>
    </div>
  );
};

export default Navbar;
