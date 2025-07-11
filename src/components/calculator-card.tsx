"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorCardProps {
  usdToVesRate: number; // Tasa BCV
  usdBinanceRate: number; // Nueva prop para la tasa de Binance
}

export function CalculatorCard({ usdToVesRate, usdBinanceRate }: CalculatorCardProps) {
  const initialUsdAmount = "1";
  const [usdAmount, setUsdAmount] = useState<string>(initialUsdAmount);

  // Estados para los montos en Bolívares y la diferencia
  const [displayVesBcvAmount, setDisplayVesBcvAmount] = useState<string>("0,0000");
  const [displayVesBinanceAmount, setDisplayVesBinanceAmount] = useState<string>("0,0000");
  const [displayDifference, setDisplayDifference] = useState<string>("0,0000");

  useEffect(() => {
    const usd = parseFloat(usdAmount);
    if (!isNaN(usd)) {
      const calculatedRawBcv = usd * usdToVesRate;
      const calculatedRawBinance = usd * usdBinanceRate;
      const difference = Math.abs(calculatedRawBcv - calculatedRawBinance); // Calcula la diferencia absoluta

      // Actualizar displayVesBcvAmount y displayVesBinanceAmount con el formato específico de la configuración regional en el cliente
      setDisplayVesBcvAmount(calculatedRawBcv.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
      setDisplayVesBinanceAmount(calculatedRawBinance.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
      setDisplayDifference(difference.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 })); // Formatea la diferencia
    } else {
      setDisplayVesBcvAmount("0,0000");
      setDisplayVesBinanceAmount("0,0000");
      setDisplayDifference("0,0000");
    }
  }, [usdAmount, usdToVesRate, usdBinanceRate]); // Recalcular cuando cualquiera de estas props cambie

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y un único punto decimal
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUsdAmount(value);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card-blue text-white rounded-xl shadow-lg border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Calculadora</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="usd-input" className="text-lg">
            Ingresa el monto en dólares:
          </Label>
          <Input
            id="usd-input"
            type="text"
            value={usdAmount}
            onChange={handleInputChange}
            className="mt-2 bg-white border-none text-card-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Bolívares (BCV):
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayVesBcvAmount}
          </div>
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Bolívares (Binance):
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayVesBinanceAmount}
          </div>
        </div>
        <div>
          <Label className="text-lg">
            Diferencia en Bolívares:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayDifference}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}