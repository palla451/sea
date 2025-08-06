/**
 * Converte una stringa nel formato 'hh:mm - dd/mm/yyyy' in un oggetto Date
 * @param input La stringa da convertire, es: '06:57 - 08/09/2025'
 * @returns Oggetto Date corrispondente
 */
export function parseCustomDateString(input: string): Date | null {
  const regex = /^(\d{2}):(\d{2}) - (\d{2})\/(\d{2})\/(\d{4})$/;
  const match = input.match(regex);

  if (!match) {
    console.warn("Formato data non valido:", input);
    return null;
  }

  const [, hoursStr, minutesStr, dayStr, monthStr, yearStr] = match;
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Mese 0-based in JS
  const year = parseInt(yearStr, 10);

  return new Date(year, month, day, hours, minutes);
}
