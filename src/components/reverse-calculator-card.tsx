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
  const [vesAmount, setVesAmount] = useState<string>("0"); // Cambiado de "1" a "0"
  const [usdEquivalent, setUsdEquivalent] = useState<string>("");
  const [euroEquivalent, setEuroEquivalent] = useState<string>("");

  useEffect(() => {
    const ves = parseFloat(vesAmount);
    if (!isNaN(ves)) {
      setUsdEquivalent((ves / usdToVesRate).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
      setEuroEquivalent((ves / euroToVesRate).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
    } else {
      setUsdEquivalent("");
      setEuroEquivalent("");
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
    <Card className="w-full max-w-md bg-gradient-card text-card-foreground rounded-xl shadow-lg">
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
            className="mt-2 bg-white/20 border-white/30 text-card-foreground placeholder:text-card-foreground/70 focus:ring-card-foreground focus:border-card-foreground"
            placeholder="0,00"
          />
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Dólares:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {usdEquivalent ? `$${usdEquivalent}` : "$0.0000"}
          </div>
        </div>
        <div>
          <Label className="text-lg">
            equivalente en Euros:
          </Label>
          <div className="text-4xl font-extrabold mt-2">
            {euroEquivalent ? `€${euroEquivalent}` : "€0.0000"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}