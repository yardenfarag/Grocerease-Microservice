function formatDate(date: Date): string {
  const pad = (n: number): string => (n < 10 ? '0' + n : n.toString())
  return (
      date.getFullYear() +
      pad(date.getMonth() + 1) +
      pad(date.getDate())
  )
}

export {
  formatDate
}
