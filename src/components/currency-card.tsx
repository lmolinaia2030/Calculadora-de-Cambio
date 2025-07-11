import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyCardProps {
  currencyName: string;
  value: number;
  change: number;
  isPositive: boolean;
}

export function CurrencyCard({
  currencyName,
  value,
  change,
  isPositive,
}: CurrencyCardProps) {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{currencyName}</CardTitle>
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toFixed(2)}</div>
        <p
          className={cn(
            "text-xs",
            isPositive ? "text-green-500" : "text-red-500"
          )}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );
}