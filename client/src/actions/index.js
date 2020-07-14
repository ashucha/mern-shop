export const addItem = (item) => {
  return {
    type: "ADD_ITEM",
    itemID: item._id,
    name: item.name,
  };
};

export const increaseQuantity = (item) => {
  return {
    type: "INCREASE_QUANTITY",
    itemID: item.id,
  };
};

export const decreaseQuantity = (item) => {
  return {
    type: "DECREASE_QUANTITY",
    itemID: item.id,
  };
};
