export const orderItemsOptions = (orderItems) => {
  if (!orderItems) return [];
  const getProduct = (orderItem) => {
    const { product, quantity } = orderItem;
    if (!product) return `${quantity}`;
    return `${product.name} ${quantity}`;
  }
  return orderItems.map((orderItem) => ({ value: orderItem.id, label: getProduct(orderItem)}))
}