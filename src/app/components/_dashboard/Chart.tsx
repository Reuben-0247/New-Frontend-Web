"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartProps = {
  label: string;
  used: number;
  total: number;
  type?: "pie" | "doughnut";
};

const formatBandwidth = (gb: number) => {
  if (gb < 1) return `${(gb * 1024).toFixed(2)} MB`;
  if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
  return `${gb.toFixed(2)} GB`;
};

export const UsageChart = ({
  label,
  used,
  total,
  type = "pie",
}: ChartProps) => {
  const remaining = Math.max(total - used, 0);

  const percentage = total === 0 ? 0 : Math.min((used / total) * 100, 100);

  const data = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        data: [used, remaining],
        backgroundColor: [
          type === "doughnut"
            ? "rgba(250, 4, 4, 0.85)"
            : "rgba(7, 42, 238, 0.6)",
          type === "doughnut"
            ? "rgba(7, 42, 238, 0.6)"
            : "rgba(7, 238, 92, 0.6)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-36 h-36 relative">
        {type === "doughnut" ? (
          <Doughnut
            data={data}
            options={{
              ...options,
              cutout: "70%",
            }}
          />
        ) : (
          <Pie data={data} options={options} />
        )}

        {type === "doughnut" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground">
        <p className="font-medium text-foreground">{label}</p>
        <p>
          {formatBandwidth(used)} / {formatBandwidth(total)}
        </p>
      </div>
    </div>
  );
};
