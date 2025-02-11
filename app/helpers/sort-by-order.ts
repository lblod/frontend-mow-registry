type Orderable = { order: number };

export default function sortByOrder(array: Orderable[]): Orderable[] {
  return [...array].sort((a, b) => a.order - b.order);
}
