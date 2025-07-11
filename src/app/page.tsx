import { MadeWithDyad } from "@/components/made-with-dyad";
import { ExchangeRateCard } from "@/components/exchange-rate-card";
import { CalculatorCard } from "@/components/calculator-card";
import { ReverseCalculatorCard } from "@/components/reverse-calculator-card";

export default function Home() {
  // Tasas de ejemplo, idealmente vendrían de una API
  const dolarBcvRate = 36.25;
  const euroRate = 39.80;
  const lastUpdatedTime = "Viernes, 1:25 PM";

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center w-full">
        <h1 className="text-4xl font-bold text-center">
          Precios del Dólar y Euro
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <ExchangeRateCard
              title="Tasa de Dólar BCV"
              currencyFrom="USD"
              currencyTo="VES"
              rate={dolarBcvRate}
              lastUpdated={lastUpdatedTime}
            />
            <ExchangeRateCard
              title="Tasa de Euro BCV"
              currencyFrom="EUR"
              currencyTo="VES"
              rate={euroRate}
              lastUpdated={lastUpdatedTime}
            />
          </div>
          <div className="flex flex-col gap-4">
            <CalculatorCard usdToVesRate={dolarBcvRate} />
            <ReverseCalculatorCard
              usdToVesRate={dolarBcvRate}
              euroToVesRate={euroRate}
            />
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}