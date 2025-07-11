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

    // Intento 1: Selectores específicos por ID (si la estructura es estable)
    const usdElementById = root.querySelector('#dolar strong');
    const euroElementById = root.querySelector('#euro strong');
    const dateElementById = root.querySelector('.date-display-single');

    if (usdElementById) {
      usdRate = parseFloat(usdElementById.text.trim().replace(',', '.'));
    }
    if (euroElementById) {
      euroRate = parseFloat(euroElementById.text.trim().replace(',', '.'));
    }
    if (dateElementById) {
      lastUpdated = dateElementById.text.trim();
    }

    // Intento 2: Búsqueda más general si los IDs específicos no funcionan, buscando por clases comunes
    if (usdRate === null || euroRate === null) {
      const currencyItems = root.querySelectorAll('.currency-item'); // Clase común para bloques de moneda
      for (const item of currencyItems) {
        const textContent = item.text;
        const strongValue = item.querySelector('strong')?.text.trim().replace(',', '.');

        if (strongValue) {
          const rate = parseFloat(strongValue);
          if (!isNaN(rate)) {
            if (textContent.includes('USD') && usdRate === null) {
              usdRate = rate;
            } else if (textContent.includes('EUR') && euroRate === null) {
              euroRate = rate;
            }
          }
        }
      }
    }

    // Intento 3: Fallback a expresiones regulares en todo el texto de la página (último recurso)
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

    // Asegurarse de que los valores no sean nulos antes de devolverlos
    if (usdRate === null || euroRate === null || lastUpdated === null) {
      console.warn("No se pudieron encontrar todas las tasas o la fecha del BCV. Usando valores de respaldo.");
      return {
        usdRate: usdRate || 0,
        euroRate: euroRate || 0,
        lastUpdated: lastUpdated || "Fecha no disponible",
      };
    }

    console.log("Tasas BCV obtenidas:", { usdRate, euroRate, lastUpdated }); // Log para depuración
    return { usdRate, euroRate, lastUpdated };

  } catch (error) {
    console.error("Error al obtener o analizar los datos del BCV:", error);
    // En caso de error, devuelve valores predeterminados para que la aplicación no falle
    return {
      usdRate: 0,
      euroRate: 0,
      lastUpdated: "Error al cargar la fecha",
    };
  }
}