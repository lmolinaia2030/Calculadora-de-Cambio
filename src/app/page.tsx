import { MadeWithDyad } from "@/components/made-with-dyad";
import { CurrencyCard } from "@/components/currency-card";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start w-full">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Precios del Dólar
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-items-center sm:justify-items-start">
          <CurrencyCard
            currencyName="Dólar Paralelo"
            value={38.50}
            change={0.75}
            isPositive={true}
          />
          <CurrencyCard
            currencyName="Dólar BCV"
            value={36.25}
            change={-0.10}
            isPositive={false}
          />
          <CurrencyCard
            currencyName="Euro"
            value={39.80}
            change={0.20}
            isPositive={true}
          />
          <CurrencyCard
            currencyName="Petro"
            value={2100.00}
            change={-1.50}
            isPositive={false}
          />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}