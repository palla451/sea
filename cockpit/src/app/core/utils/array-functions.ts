/**
 * funzione di utilita che converte sei Set di stringhe in array di stringhe
 * molto utile per oggetti tipo multiselect di stringhe utilizzati
 * per esempio nei filtri delle sidebar
 * @param set set di stringhe in ingresso
 * @returns array di stringhe corrispondente
 */

export function convertSetToArray(set: Set<string>): string[] {
  return Array.from(set);
}
