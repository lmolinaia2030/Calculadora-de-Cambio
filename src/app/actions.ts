"use server";

import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el locale español para date-fns

export async function getBcvRates() {
  try {
    // Realiza la solicitud a la API de PyDolarVe para el dólar. Revalida cada hora.
    const usdResponse = await fetch('https://pydolarve.vercel.app/api/v2/dollar', { next: { revalidate: 3600 } });
    // Realiza la solicitud a la API de PyDolarVe para el euro. Revalida cada hora.
    const euroResponse = await fetch('https://pydolarve.vercel.app/api/v2/euro', { next: { revalidate: 3600 } });

    if (!usdResponse.ok) {
      throw new Error(`Failed to fetch USD rate from API: ${usdResponse.status} ${usdResponse.statusText}`);
    }
    if (!euroResponse.ok) {
      throw new Error(`Failed to fetch EUR rate from API: ${euroResponse.status} ${euroResponse.statusText}`);
    }

    const usdData = await usdResponse.json();
    const euroData = await euroResponse.json();

    const usdRate = parseFloat(usdData.price);
    const euroRate = parseFloat(euroData.price);

    // La API devuelve la fecha en formato ISO 8601 (ej. "2024-07-11T17:00:00Z").
    // La formateamos para una visualización amigable.
    let lastUpdated: string;
    try {
      // Asumimos que ambas tasas tienen la misma fecha de última actualización o tomamos la del USD.
      const date = new Date(usdData.last_update);
      lastUpdated = format(date, "dd 'de' MMMM 'de' yyyy, HH:mm 'VET'", { locale: es });
    } catch (dateError) {
      console.error("Error formatting date from API:", dateError);
      lastUpdated = "Fecha no disponible";
    }

    // Validar que las tasas sean números válidos
    if (isNaN(usdRate) || isNaN(euroRate)) {
      console.warn("API returned non-numeric rates. Using fallback values.");
      return {
        usdRate: 0,
        euroRate: 0,
        lastUpdated: "Datos no válidos de la API",
      };
    }

    console.log("Tasas obtenidas de PyDolarVe API:", { usdRate, euroRate, lastUpdated });
    return { usdRate, euroRate, lastUpdated };

  } catch (error: any) {
    console.error("Error al obtener datos de la API de PyDolarVe:", error);
    return {
      usdRate: 0,
      euroRate: 0,
      lastUpdated: `Error de conexión: ${error.message || 'No se pudo conectar a la API.'}`,
    };
  }
}