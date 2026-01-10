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
      <div className="h-full flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Upload a file and ask questions to see insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-5 h-full overflow-y-auto">
      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
            <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-500">Total Spent</p>
            <p className="font-bold text-sm sm:text-lg">
              ₹{summary.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-500">Top Category</p>
            <p className="font-bold text-sm sm:text-lg truncate">{summary.topCategory}</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-xs text-gray-500">Transactions</p>
            <p className="font-bold text-sm sm:text-lg">{summary.transactionCount}</p>
          </div>
        </div>
      )}

      {/* CHART */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl border p-3 sm:p-5 shadow-sm">
          <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-3 sm:mb-4 uppercase tracking-wide">
            Spending by Category
          </h3>
          <ExpenseChart data={chartData} />
        </div>
      )}

      {/* TABLE */}
      {tableData.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl border shadow-sm overflow-hidden max-h-[300px] sm:max-h-[380px]">
          <div className="px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-100">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Recent Transactions
            </h3>
          </div>
          <ExpenseTable data={tableData} />
        </div>
      )}
    </div>
  );
}
