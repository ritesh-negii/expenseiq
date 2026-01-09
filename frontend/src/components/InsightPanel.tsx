import ExpenseChart from "./ExpenseChart";
import ExpenseTable from "./ExpenseTable";

type Props = {
  chartData: any[];
  tableData: any[];
};

export default function InsightPanel({ chartData, tableData }: Props) {
  return (
    <div className="border-t px-6 py-4 space-y-6">
      {chartData.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600">
            Spending by Category
          </h3>
          <ExpenseChart data={chartData} />
        </>
      )}

      {tableData.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-600">
            Recent Transactions
          </h3>
          <ExpenseTable data={tableData} />
        </>
      )}
    </div>
  );
}
