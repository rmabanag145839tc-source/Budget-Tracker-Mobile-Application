// Keep every displayed amount in the same Philippine peso format.
const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export function formatPeso(amount) {
  return pesoFormatter.format(amount);
}
