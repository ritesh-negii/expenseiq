type Props = {
  data: any[];
};

export default function ExpenseTable({ data }: Props) {
  return (
   <div className="overflow-x-auto max-h-[320px] overflow-y-auto">

      <table className="w-full text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-3 py-2.5 whitespace-nowrap text-gray-500">
                {row.date}
              </td>
              <td className="px-3 py-2.5 text-gray-900">
                {row.description}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  {row.category}
                </span>
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-right font-semibold text-gray-900">
                ₹{Number(row.amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
