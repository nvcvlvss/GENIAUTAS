/**
 * Lista de palabras y frases prohibidas para el MVP de GENIAUTAS.
 * Cubre categorías de: Lenguaje ofensivo, Odio, Violencia, Autodaño y Drogas.
 */
export const FORBIDDEN_WORDS = [
  // Lenguaje ofensivo / Insultos comunes (Chile/General)
  "hueon", "weon", "culiao", "concha", "mierda", "puta", "pendejo", "bastardo",
  
  // Violencia / Armas
  "matar", "asesinar", "pistola", "bomba", "terrorismo", "sangre", "golpear",
  
  // Autodaño
  "suicidio", "cortarme", "morir", "matarme",
  
  // Odio / Discriminación
  "nazi", "racista", "facho", "comunista", // términos usados peyorativamente
  
  // Drogas
  "droga", "cocaina", "marihuana", "pasta base", "pastillas"
];

/**
 * Valida si un texto contiene palabras prohibidas.
 * @param text El texto a validar.
 * @returns Un objeto con el resultado de la validación.
 */
export function validateInput(text: string): { isValid: boolean; word?: string } {
  const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(normalizedText)) {
      return { isValid: false, word };
    }
  }
  
  return { isValid: true };
}
