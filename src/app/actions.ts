"use server";

import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

export async function getExchangeRates() { // Renombrada la función
  try {
    // Realiza la solicitud a la API de PyDolarVe para el dólar BCV
    const usdBcvResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=usd', { next: { revalidate: 3600 } });
    // Realiza la solicitud a la API de PyDolarVe para el euro BCV
    const euroBcvResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=eur', { next: { revalidate: 3600 } });
    // Realiza la solicitud a la API de PyDolarVe para el dólar Binance
    const usdBinanceResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=usd&exchange=binance', { next: { revalidate: 3600 } });

    if (!usdBcvResponse.ok) {
      throw new Error(`Failed to fetch USD BCV rate from API: ${usdBcvResponse.status} ${usdBcvResponse.statusText}`);
    }
    if (!euroBcvResponse.ok) {
      throw new Error(`Failed to fetch EUR BCV rate from API: ${euroBcvResponse.status} ${euroBcvResponse.statusText}`);
    }
    if (!usdBinanceResponse.ok) {
      throw new Error(`Failed to fetch USD Binance rate from API: ${usdBinanceResponse.status} ${usdBinanceResponse.statusText}`);
    }

    const usdBcvData = await usdBcvResponse.json();
    const euroBcvData = await euroBcvResponse.json();
    const usdBinanceData = await usdBinanceResponse.json();

    const usdBcvRate = parseFloat(usdBcvData.price);
    const euroBcvRate = parseFloat(euroBcvData.price);
    const usdBinanceRate = parseFloat(usdBinanceData.price); // Nueva tasa de Binance

    let lastUpdated: string;
    try {
      // Usar la fecha de última actualización del USD BCV para todas las tarjetas por consistencia
      const dateString = usdBcvData.last_update;
      const parsedDate = parse(dateString, "dd/MM/yyyy, hh:mm a", new Date(), { locale: es });
      lastUpdated = "Última Actualización: " + format(parsedDate, "dd 'de' MMMM 'de' yyyy, hh:mm a", { locale: es });
    } catch (dateError) {
      console.error("Error formatting date from API:", dateError);
      lastUpdated = "Última Actualización: Fecha no disponible";
    }

    // Validar que todas las tasas sean números válidos
    if (isNaN(usdBcvRate) || isNaN(euroBcvRate) || isNaN(usdBinanceRate)) {
      console.warn("API returned non-numeric rates. Using fallback values.");
      return {
        usdBcvRate: 0,
        euroBcvRate: 0,
        usdBinanceRate: 0, // Fallback para Binance
        lastUpdated: "Última Actualización: Datos no válidos de la API",
      };
    }

    console.log("Tasas obtenidas de PyDolarVe API:", { usdBcvRate, euroBcvRate, usdBinanceRate, lastUpdated });
    return { usdBcvRate, euroBcvRate, usdBinanceRate, lastUpdated }; // Retorna la nueva tasa

  } catch (error: any) {
    console.error("Error al obtener datos de la API de PyDolarVe:", error);
    return {
      usdBcvRate: 0,
      euroBcvRate: 0,
      usdBinanceRate: 0, // Fallback para Binance
      lastUpdated: `Última Actualización: Error de conexión: ${error.message || 'No se pudo conectar a la API.'}`,
    };
  }
}