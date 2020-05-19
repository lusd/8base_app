import * as R from "ramda";

export const getTotalOrderCost = (items) => {
  if (items.length === 0) {
    return 0;
  }
  const initialValue = 0;
  const totalPrice = items.reduce((acc, item) => {
    const quantity = R.pathOr(null, ['quantity'], item);
    const price = R.pathOr(null, ['product', 'price'], item);
    if (quantity === null || price === null) {
      return 0;
    };
    return acc + quantity * price;
  }, initialValue);
  return totalPrice.toFixed(2) + "$";
};