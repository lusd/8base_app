export const ordersListOptions = (orders) => {
  if (!orders) return [];
  return orders.map((order) => ({ value: order.id, label: order.address }));
};