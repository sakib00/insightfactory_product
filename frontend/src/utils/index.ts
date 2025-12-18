export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US').format(date)
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}
