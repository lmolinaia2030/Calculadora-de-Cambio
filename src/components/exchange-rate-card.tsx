"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  return (
    <Card className="w-full max-w-md bg-gradient-card text-card-foreground rounded-xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-lg">
          1 {currencyFrom} es equivalente a:
        </p>
        <div className="text-5xl font-extrabold">
          {rate.toLocaleString('es-VE', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
        </div>
        <p className="text-sm opacity-80">
          {lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}