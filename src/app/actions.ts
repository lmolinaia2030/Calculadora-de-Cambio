"use server";

import { parse } from 'node-html-parser';

export async function getBcvRates() {
  try {
    // Realiza la solicitud a la página del BCV. Revalida cada hora para obtener datos actualizados.
    const response = await fetch('https://www.bcv.org.ve/', { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch BCV data: ${response.statusText}`);
    }
    const html = await response.text();
    const root = parse(html);

    let usdRate: number | null = null;
    let euroRate: number | null = null;
    let lastUpdated: string | null = null;

    // Intenta encontrar los elementos específicos por sus IDs o clases comunes en la página del BCV
    const usdElement = root.querySelector('#dolar strong');
    const euroElement = root.querySelector('#euro strong');
    const dateElement = root.querySelector('.date-display-single');

    if (usdElement) {
      usdRate = parseFloat(usdElement.text.trim().replace(',', '.'));
    }

    if (euroElement) {
      euroRate = parseFloat(euroElement.text.trim().replace(',', '.'));
    }

    if (dateElement) {
      lastUpdated = dateElement.text.trim();
    }

    // Fallback: Si los selectores específicos no funcionan, intenta buscar en todo el texto de la página
    if (usdRate === null || euroRate === null || lastUpdated === null) {
        const pageText = root.text;

        const usdMatch = pageText.match(/\$ USD\s*([\d.,]+)/);
        if (usdMatch && usdMatch[1]) {
            usdRate = parseFloat(usdMatch[1].replace(',', '.'));
        }

        const euroMatch = pageText.match(/€ EUR\s*([\d.,]+)/);
        if (euroMatch && euroMatch[1]) {
            euroRate = parseFloat(euroMatch[1].replace(',', '.'));
        }

        const dateMatch = pageText.match(/Fecha Valor:\s*(.+)/);
        if (dateMatch && dateMatch[1]) {
            lastUpdated = dateMatch[1].trim();
        }
    }

    // Si aún no se encuentran los datos, usa valores predeterminados y registra una advertencia
    if (usdRate === null || euroRate === null || lastUpdated === null) {
      console.warn("Could not find all BCV rates or date. Using fallback values.");
      return {
        usdRate: 0, // Valor de respaldo
        euroRate: 0, // Valor de respaldo
        lastUpdated: "Fecha no disponible",
      };
    }

    return { usdRate, euroRate, lastUpdated };

  } catch (error) {
    console.error("Error fetching or parsing BCV data:", error);
    // En caso de error, devuelve valores predeterminados para que la aplicación no falle
    return {
      usdRate: 0,
      euroRate: 0,
      lastUpdated: "Error al cargar la fecha",
    };
  }
}