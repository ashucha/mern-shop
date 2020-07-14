import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "bootstrap";

// Components
import Navbar from "./components/Navbar";

// Styles
import "./App.css";
import { addItem, increaseQuantity, decreaseQuantity } from "./actions";

const App = () => {
  const [items, setItems] = useState([]);
  fetch("http://localhost:5000/api/items")
    .then((res) => res.json())
    .then((data) => setItems(data));

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const cartHasItem = (itemID) => {
    return cart.find((item) => item.itemID === itemID) ? true : false;
  };

  return (
    <div className="App">
      <Navbar></Navbar>
      <h1>Hi</h1>
      <h3>Items: </h3>
      {items.map((item) => (
        <button
          key={item._id}
          onClick={() => dispatch(addItem(item))}
          disabled={cartHasItem(item._id)}
        >
          {item.name}
        </button>
      ))}
      <h3>Cart: </h3>
      <ul>
        {cart.map((cartItem) => (
          <li key={cartItem.id}>
            <span>{cartItem.name}</span>
            <button onClick={() => dispatch(increaseQuantity(cartItem))}>
              +
            </button>
            <button onClick={() => dispatch(decreaseQuantity(cartItem))}>
              -
            </button>
            <span>Quantity: {cartItem.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
