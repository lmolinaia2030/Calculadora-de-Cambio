"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReverseCalculatorCardProps {
  usdToVesRate: number;
  euroToVesRate: number;
}

export function ReverseCalculatorCard({
  usdToVesRate,
  euroToVesRate,
}: ReverseCalculatorCardProps) {
  const initialVesAmount = "0";
  const [vesAmount, setVesAmount] = useState<string>(initialVesAmount);

  // Calcular los valores iniciales en USD y EUR para el renderizado del servidor
  const initialRawUsdEquivalent = parseFloat(initialVesAmount) / usdToVesRate;
  const initialRawEuroEquivalent = parseFloat(initialVesAmount) / euroToVesRate;

  // Inicializar los estados de visualización con un formato no dependiente de la configuración regional para el servidor
  const [displayUsdEquivalent, setDisplayUsdEquivalent] = useState<string>(
    isNaN(initialRawUsdEquivalent) ? "$0.0000" : `$${initialRawUsdEquivalent.toFixed(4)}`
  );
  const [displayEuroEquivalent, setDisplayEuroEquivalent] = useState<string>(
    isNaN(initialRawEuroEquivalent) ? "€0.0000" : `€${initialRawEuroEquivalent.toFixed(4)}`
  );

  useEffect(() => {
    const ves = parseFloat(vesAmount);
    if (!isNaN(ves)) {
      const calculatedUsd = ves / usdToVesRate;
      const calculatedEuro = ves / euroToVesRate;

      // Actualizar displayUsdEquivalent y displayEuroEquivalent con el formato específico de la configuración regional en el cliente
      setDisplayUsdEquivalent(`$${calculatedUsd.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`);
      setDisplayEuroEquivalent(`€${calculatedEuro.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`);
    } else {
      setDisplayUsdEquivalent("$0.0000");
      setDisplayEuroEquivalent("€0.0000");
    }
  }, [vesAmount, usdToVesRate, euroToVesRate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y un único punto decimal
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setVesAmount(value);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card-blue text-white rounded-xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Calculadora Inversa</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="ves-input" className="text-lg">
            Ingresa el monto en Bolívares:
          </Label>
          <Input
            id="ves-input"
            type="text"
            value={vesAmount}
            onChange={handleInputChange}
            className="mt-2 bg-white border-input text-card-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
            placeholder="0,00"
          />
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Dólares:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayUsdEquivalent}
          </div>
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Euros:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {displayEuroEquivalent}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}