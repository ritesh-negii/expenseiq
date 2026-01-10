
//this indicates the type of a message
export type Message = {
  role: "user" | "assistant";
  text: string;
};

export type Summary = {
  total: number;
  topCategory: string;
  transactionCount: number;
};

