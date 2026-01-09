type Props = {
  data: any[];
};

export default function ExpenseTable({ data }: Props) {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Description</th>
          <th className="p-2 text-left">Category</th>
          <th className="p-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{row.date}</td>
            <td className="p-2">{row.description}</td>
            <td className="p-2">{row.category}</td>
            <td className="p-2 text-right">₹{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
