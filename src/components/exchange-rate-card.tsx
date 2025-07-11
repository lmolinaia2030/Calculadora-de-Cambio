"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ExchangeRateCardProps {
  title: string;
  currencyFrom: string;
  currencyTo: string;
  rate: number;
  lastUpdated: string;
}

export function ExchangeRateCard({
  title,
  currencyFrom,
  currencyTo,
  rate,
  lastUpdated,
}: ExchangeRateCardProps) {
  // Estado para mantener la tasa formateada para la visualización en el cliente
  const [displayRate, setDisplayRate] = useState<string>(
    // Formato inicial no dependiente de la configuración regional para el renderizado del servidor
    rate.toFixed(4).replace('.', ',')
  );

  useEffect(() => {
    // Actualizar con el formato específico de la configuración regional solo en el cliente después del montaje
    setDisplayRate(rate.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
  }, [rate]); // Recalcular cuando la prop 'rate' cambie

  return (
    <Card className="w-full max-w-md bg-gradient-card-blue text-white rounded-xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-lg">
          1 {currencyFrom} es equivalente a:
        </p>
        <div className="text-5xl font-extrabold">
          {displayRate} {/* Usar el estado para la visualización */}
        </div>
        <p className="text-sm opacity-80">
          {lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}