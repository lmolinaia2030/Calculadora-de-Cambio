"use server";

import { format, parse } from 'date-fns'; // Importa 'parse' para analizar la fecha
import { es } from 'date-fns/locale'; // Importa el locale español para date-fns

export async function getBcvRates() {
  try {
    // Realiza la solicitud a la API de PyDolarVe para el dólar (endpoint tipo-cambio). Revalida cada hora.
    const usdResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=usd', { next: { revalidate: 3600 } });
    // Realiza la solicitud a la API de PyDolarVe para el euro (endpoint tipo-cambio). Revalida cada hora.
    const euroResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=eur', { next: { revalidate: 3600 } });

    if (!usdResponse.ok) {
      throw new Error(`Failed to fetch USD rate from API: ${usdResponse.status} ${usdResponse.statusText}`);
    }
    if (!euroResponse.ok) {
      throw new Error(`Failed to fetch EUR rate from API: ${euroResponse.status} ${euroResponse.statusText}`);
    }

    const usdData = await usdResponse.json();
    const euroData = await euroResponse.json();

    // Acceder al precio directamente para el dólar, ya que la respuesta es plana
    const usdRate = parseFloat(usdData.price);
    // Acceder al precio directamente para el euro, ya que la respuesta es plana
    const euroRate = parseFloat(euroData.price);

    let lastUpdated: string;
    try {
      // Usar la fecha de última actualización del USD, que está en un formato más fácil de parsear.
      // Ejemplo de formato de la API: "11/07/2025, 12:00 AM"
      const dateString = usdData.last_update;
      const parsedDate = parse(dateString, "dd/MM/yyyy, hh:mm a", new Date(), { locale: es });
      // Cambiado el formato de salida para usar hh:mm a (12 horas con AM/PM)
      lastUpdated = "Última Actualización: " + format(parsedDate, "dd 'de' MMMM 'de' yyyy, hh:mm a", { locale: es });
    } catch (dateError) {
      console.error("Error formatting date from API:", dateError);
      lastUpdated = "Última Actualización: Fecha no disponible";
    }

    // Validar que las tasas sean números válidos
    if (isNaN(usdRate) || isNaN(euroRate)) {
      console.warn("API returned non-numeric rates. Using fallback values.");
      return {
        usdRate: 0,
        euroRate: 0,
        lastUpdated: "Última Actualización: Datos no válidos de la API",
      };
    }

    console.log("Tasas obtenidas de PyDolarVe API:", { usdRate, euroRate, lastUpdated });
    return { usdRate, euroRate, lastUpdated };

  } catch (error: any) {
    console.error("Error al obtener datos de la API de PyDolarVe:", error);
    return {
      usdRate: 0,
      euroRate: 0,
      lastUpdated: `Última Actualización: Error de conexión: ${error.message || 'No se pudo conectar a la API.'}`,
    };
  }
}