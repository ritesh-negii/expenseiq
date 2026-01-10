import ExpenseChart from "./ExpenseChart";
import ExpenseTable from "./ExpenseTable";
import { BarChart3, IndianRupee, Layers, List } from "lucide-react";
import type { Summary } from "../types";

type Props = {
  chartData: any[];
  tableData: any[];
  summary?: Summary | null;
};

export default function InsightPanel({ chartData, tableData, summary }: Props) {
  if (!summary && chartData.length === 0 && tableData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">
            Upload a file and ask questions to see insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-5 h-full overflow-y-auto">
      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <IndianRupee className="w-4 h-4 text-purple-600 mb-2" />
            <p className="text-xs text-gray-500">Total Spent</p>
            <p className="font-bold text-lg">
              ₹{summary.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <Layers className="w-4 h-4 text-purple-600 mb-2" />
            <p className="text-xs text-gray-500">Top Category</p>
            <p className="font-bold text-lg">{summary.topCategory}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <List className="w-4 h-4 text-purple-600 mb-2" />
            <p className="text-xs text-gray-500">Transactions</p>
            <p className="font-bold text-lg">{summary.transactionCount}</p>
          </div>
        </div>
      )}

      {/* CHART */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
            Spending by Category
          </h3>
          <ExpenseChart data={chartData} />
        </div>
      )}

      {/* TABLE */}
      {tableData.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden max-h-[380px]">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Recent Transactions
            </h3>
          </div>
          <ExpenseTable data={tableData} />
        </div>
      )}
    </div>
  );
}
