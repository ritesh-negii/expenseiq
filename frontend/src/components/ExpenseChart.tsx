import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: any[];
};

const COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
];

export default function ExpenseChart({ data }: Props) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            formatter={(value: any) => [`₹${value}`, "Amount"]}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
