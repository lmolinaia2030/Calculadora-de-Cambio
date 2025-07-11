"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorCardProps {
  usdToVesRate: number;
}

export function CalculatorCard({ usdToVesRate }: CalculatorCardProps) {
  const initialUsdAmount = "1";
  const [usdAmount, setUsdAmount] = useState<string>(initialUsdAmount);

  // Calcular el valor inicial en Bolívares para el renderizado del servidor
  const initialRawVesAmount = parseFloat(initialUsdAmount) * usdToVesRate;
  // Inicializar el estado de visualización con un formato no dependiente de la configuración regional para el servidor
  const [displayVesAmount, setDisplayVesAmount] = useState<string>(
    isNaN(initialRawVesAmount) ? "0,0000" : initialRawVesAmount.toFixed(4).replace('.', ',')
  );

  useEffect(() => {
    const usd = parseFloat(usdAmount);
    if (!isNaN(usd)) {
      const calculatedRaw = usd * usdToVesRate;
      // Actualizar displayVesAmount con el formato específico de la configuración regional en el cliente
      setDisplayVesAmount(calculatedRaw.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
    } else {
      setDisplayVesAmount("0,0000");
    }
  }, [usdAmount, usdToVesRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y un único punto decimal
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUsdAmount(value);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card text-card-foreground rounded-xl shadow-lg">
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
            className="mt-2 bg-white/20 border-white/30 text-card-foreground placeholder:text-card-foreground/70 focus:ring-card-foreground focus:border-card-foreground"
            placeholder="0.00"
          />
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Bolívares:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayVesAmount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}