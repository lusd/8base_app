export const productsOptions = (products) => {
  if (!products) return [];
  return products.map((product) => ({ value: product.id, label: product.name }))
}