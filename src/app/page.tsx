import { MadeWithDyad } from "@/components/made-with-dyad";
import { ExchangeRateCard } from "@/components/exchange-rate-card";
import { CalculatorCard } from "@/components/calculator-card";
import { CalculadoraBsToBCV } from "@/components/calculadora-bs-to-bcv";
import { getExchangeRates } from "@/app/actions";

export default async function Home() {
  const { usdBcvRate, euroBcvRate, usdBinanceRate, usdBcvLastUpdated, euroBcvLastUpdated, usdBinanceLastUpdated } = await getExchangeRates();

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center w-full">
        <h1 className="text-4xl font-bold text-center">
          Calculadora de Tasa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <ExchangeRateCard
              title="Tasa de Dólar BCV"
              currencyFrom="USD"
              currencyTo="VES"
              rate={usdBcvRate}
              lastUpdated={usdBcvLastUpdated}
            />
            <ExchangeRateCard
              title="Tasa de Dólar Binance"
              currencyFrom="USD"
              currencyTo="VES"
              rate={usdBinanceRate}
              lastUpdated={usdBinanceLastUpdated}
            />
            <ExchangeRateCard
              title="Tasa de Euro BCV"
              currencyFrom="EUR"
              currencyTo="VES"
              rate={euroBcvRate}
              lastUpdated={euroBcvLastUpdated}
            />
          </div>
          <div className="flex flex-col gap-4">
            <CalculatorCard
              usdToVesRate={usdBcvRate}
              usdBinanceRate={usdBinanceRate}
            />
            <CalculadoraBsToBCV
              usdToVesRate={usdBcvRate}
              euroToVesRate={euroBcvRate}
            />
          </div>
        </div>
      </main>
      {/* <MadeWithDyad /> */}
    </div>
  );
}