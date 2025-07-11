"use server";

import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

export async function getExchangeRates() {
  try {
    // Realiza la solicitud a la API de PyDolarVe para el dólar BCV
    const usdBcvResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=usd', { next: { revalidate: 3600 } });
    // Realiza la solicitud a la API de PyDolarVe para el euro BCV
    const euroBcvResponse = await fetch('https://pydolarve.org/api/v2/tipo-cambio?currency=eur', { next: { revalidate: 3600 } });

    // Realiza la solicitud a la API de Binance P2P para el dólar Binance
    const usdBinanceResponse = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'cid=rujCuvlC', // Incluido como se solicitó, aunque las cookies pueden ser dinámicas
      },
      body: JSON.stringify({
        "fiat":"VES",
        "page":1,
        "rows":5,
        "transAmount":500,
        "tradeType":"SELL",
        "asset":"USDT",
        "countries":[],
        "proMerchantAds":false,
        "shieldMerchantAds":false,
        "filterType":"all",
        "periods":[],
        "additionalKycVerifyFilter":0,
        "publisherType":"merchant",
        "payTypes":["SpecificBank"],
        "classifies":["mass","profession","fiat_trade"],
        "tradedWith":false,
        "followed":false
      }),
      next: { revalidate: 3600 } // Revalida cada hora
    });

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

    let usdBinanceRate: number;
    if (usdBinanceData && Array.isArray(usdBinanceData.data) && usdBinanceData.data.length > 0) {
      // Extraer y parsear los precios, filtrando cualquier NaN
      const prices = usdBinanceData.data
        .map((item: any) => parseFloat(item.adv.price))
        .filter((price: number) => !isNaN(price));

      if (prices.length > 0) {
        // Calcular el promedio de los precios, especificando los tipos para 'acc' y 'price'
        const sum = prices.reduce((acc: number, price: number) => acc + price, 0);
        usdBinanceRate = sum / prices.length;
      } else {
        usdBinanceRate = 0; // No se encontraron precios válidos
      }
    } else {
      usdBinanceRate = 0; // No hay datos o el formato es incorrecto
    }

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
        usdBinanceRate: 0,
        lastUpdated: "Última Actualización: Datos no válidos de la API",
      };
    }

    console.log("Tasas obtenidas:", { usdBcvRate, euroBcvRate, usdBinanceRate, lastUpdated });
    return { usdBcvRate, euroBcvRate, usdBinanceRate, lastUpdated };

  } catch (error: any) {
    console.error("Error al obtener datos de la API:", error);
    return {
      usdBcvRate: 0,
      euroBcvRate: 0,
      usdBinanceRate: 0,
      lastUpdated: `Última Actualización: Error de conexión: ${error.message || 'No se pudo conectar a la API.'}`,
    };
  }
}