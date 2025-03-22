function formatDateBeautify(date_string: string): string {
  const date = new Date(date_string);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString(undefined, options);
}
