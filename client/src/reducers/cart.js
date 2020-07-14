let targetItem, itemIndex;

export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_ITEM":
      // console.log(state.find((item) => item.itemID === action.itemID));
      if (state.find((item) => item.id === action.itemID)) {
        targetItem = state.find((item) => item.id === action.itemID);
        itemIndex = state.indexOf(targetItem);
        targetItem.quantity++;
        state[itemIndex] = targetItem;
        return state;
      } else
        return [
          ...state,
          { id: action.itemID, name: action.name, quantity: 1 },
        ];
    case "INCREASE_QUANTITY":
      targetItem = state.find((item) => item.id === action.itemID);
      itemIndex = state.indexOf(targetItem);
      targetItem.quantity++;
      state[itemIndex] = targetItem;
      return state;
    case "DECREASE_QUANTITY":
      targetItem = state.find((item) => item.id === action.itemID);
      itemIndex = state.indexOf(targetItem);
      if (targetItem.quantity > 1) {
        targetItem.quantity--;
        state[itemIndex] = targetItem;
      }
      return state;
    default:
      return state;
  }
};
