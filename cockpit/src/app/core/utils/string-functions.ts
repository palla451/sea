// Funzione helper per generare una stringa random non vuota e non composta da un solo spazio
export function generateNonEmptyRandomString(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Lunghezza tra 10 e 20 caratteri
  const length = Math.floor(Math.random() * 11) + 10;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function capitalizeFirstLetter(input: string): string {
  if (!input) return "";
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Anonimizza solo la parte dopo 'https://' o 'http://' nei messaggi di errore.
 * Esempio: "https://api.miosito.com/user/123" => "https://xxxxxxxxx"
 *
 * @param errorMessage Il messaggio di errore proveniente dalle API
 * @returns Il messaggio anonimizzato
 */
export function sanitizeErrorMessage(errorMessage: string): string {
  if (!errorMessage) {
    return "";
  }

  const urlRegex = /(https?:\/\/)[^\s'"<>]+/gi;
  return errorMessage.replace(
    urlRegex,
    (_, protocol) => `${protocol}xxxxxxxxx`
  );
}
