import { PriceObject } from "@/types/price";

interface PriceProps {
    price: PriceObject;
    signed?: boolean;
    precision?: number;
    className?: string;
    colorize?: boolean;
}

export const Price: React.FC<PriceProps> = ({
    price,
    signed = false,
    precision = 2,
    className = "",
    colorize = false,
}) => {
    const { amount, currency = "INR" } = price;

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        signDisplay: signed ? "always" : "auto",
    });

    const formatted = formatter.format(amount);

    const colorClass =
        colorize && amount !== 0
            ? amount > 0
                ? "text-green-500"
                : "text-red-500"
            : "";

    return <span className={`${className} ${colorClass}`}>{formatted}</span>;
};
