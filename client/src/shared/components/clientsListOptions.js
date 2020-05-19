export const clientsListOptions = (clients) => {
  if (!clients) return [];
  return clients.map((client) => ({value: client.id, label: `${client.firstName} ${client.lastName}` }))
}