type UsageData = {
  label: string;
  used: number;
  total: number;
  color: string;
};

type Props = {
  granted: {
    storageGB: number;
    bandwidthGB: number;
  };
  used: {
    storageGB: number;
    bandwidthGB: number;
  };
};

export const ProgressBar = ({ label, used, total, color }: UsageData) => {
  const percentage = total === 0 ? 0 : Math.min((used / total) * 100, 100);
  const formatBandwidth = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(2)} MB`;
    }

    if (gb >= 1024) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }

    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <span>
          {formatBandwidth(used)} / {formatBandwidth(total)}
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-[10px] text-right text-muted-foreground">
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
};

export const UsageProgress = ({ granted, used }: Props) => {
  if (!granted || !used) return null;

  const remaining = {
    storageGB: Math.max(granted.storageGB - used.storageGB, 0),
    bandwidthGB: Math.max(granted.bandwidthGB - used.bandwidthGB, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">Granted</h3>

        <div className="space-y-4">
          <ProgressBar
            label="Storage"
            used={granted.storageGB}
            total={granted.storageGB}
            color="bg-blue-400"
          />

          <ProgressBar
            label="Bandwidth"
            used={granted.bandwidthGB}
            total={granted.bandwidthGB}
            color="bg-purple-400"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">Used</h3>

        <div className="space-y-4">
          <ProgressBar
            label="Storage"
            used={used.storageGB}
            total={granted.storageGB}
            color="bg-blue-600"
          />

          <ProgressBar
            label="Bandwidth"
            used={used.bandwidthGB}
            total={granted.bandwidthGB}
            color="bg-purple-600"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">
          Remaining
        </h3>

        <div className="space-y-4">
          <ProgressBar
            label="Storage"
            used={remaining.storageGB}
            total={granted.storageGB}
            color="bg-green-500"
          />

          <ProgressBar
            label="Bandwidth"
            used={remaining.bandwidthGB}
            total={granted.bandwidthGB}
            color="bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
