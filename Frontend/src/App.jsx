import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Expense");

  const [friendName, setFriendName] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [debtType, setDebtType] = useState("I owe");

  const fetchData = async () => {
    const transRes = await axios.get(
      "http://127.0.0.1:5000/transactions"
    );

    const debtRes = await axios.get(
      "http://127.0.0.1:5000/debts"
    );

    setTransactions(transRes.data);
    setDebts(debtRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTransaction = async () => {

      if (!amount || !category.trim()) {
    alert("Please fill all fields");
    return;
  }

    await axios.post(
      "http://127.0.0.1:5000/transactions",
      {
        amount,
        category,
        type,
      }
    );

    setAmount("");
    setCategory("");

    fetchData();
  };

 const addDebt = async () => {

  if (!friendName || !debtAmount) {
    alert("Please fill all fields");
    return;
  }

  await axios.post(
    "http://127.0.0.1:5000/debts",
    {
      friend_name: friendName,
      amount: debtAmount,
      debt_type: debtType,
    }
  );

  setFriendName("");
  setDebtAmount("");

  fetchData();
};
  const settleDebt = async (id) => {

  await axios.put(
    `http://127.0.0.1:5000/debts/${id}/settle`
  );

  fetchData();
};
const balance = transactions.reduce((acc, t) => {
  return t.type === "Income"
    ? acc + Number(t.amount)
    : acc - Number(t.amount);
}, 0);

const owedToMe = debts
  .filter(
    (d) =>
      d.debt_type === "Owes Me" &&
      d.status === "Pending"
  )
  .reduce(
    (acc, d) => acc + Number(d.amount),
    0
  );

const iOwe = debts
  .filter(
    (d) =>
      d.debt_type === "I Owe" &&
      d.status === "Pending"
  )
  .reduce(
    (acc, d) => acc + Number(d.amount),
    0
  );

  return (
  <div className="container">

    <h1 className="title"> Finance Planner</h1>

    <div className="summary">
      <div className="summary-card balance">
        <h3>Balance</h3>
        <p>₹{balance}</p>
      </div>

      <div className="summary-card owed">
        <h3>Owed To Me</h3>
        <p>₹{owedToMe}</p>
      </div>

      <div className="summary-card owe">
        <h3>I Owe</h3>
        <p>₹{iOwe}</p>
      </div>
    </div>

    <div className="grid">

      <div className="card">
        <h2> Add Transaction</h2>

        <div className="form-row">
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Income</option>
            <option>Expense</option>
          </select>

          <button onClick={addTransaction}>
            Add Transaction
          </button>
        </div>
      </div>

      <div className="card">
        <h2> Add Debt</h2>

        <div className="form-row">
          <input
            placeholder="Friend Name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />

          <input
            placeholder="Amount"
            value={debtAmount}
            onChange={(e) => setDebtAmount(e.target.value)}
          />

          <select
            value={debtType}
            onChange={(e) => setDebtType(e.target.value)}
          >
            <option>Owes Me</option>
            <option>I Owe</option>
          </select>

          <button onClick={addDebt}>
            Add Debt
          </button>
        </div>
      </div>

    </div>

    <div className="card">
      <h2> Transactions</h2>

      {transactions.map((t) => (
        <div className="list-item" key={t.id}>
          <span>{t.category}</span>

          <span className={
            t.type === "Income"
              ? "income"
              : "expense"
          }>
            ₹{t.amount} ({t.type})
          </span>
        </div>
      ))}
    </div>

    <div className="card">
      <h2> Debts</h2>

      {debts
        .filter(d => d.friend_name && d.amount)
        .map((d) => (
          <div className="list-item" key={d.id}>

            <span>
              {d.friend_name} - ₹{d.amount}
              {" "}
              ({d.debt_type})
            </span>

            <span>
              <span
                className={
                  d.status === "Pending"
                    ? "pending"
                    : "settled"
                }
              >
                {d.status}
              </span>

              {d.status === "Pending" && (
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => settleDebt(d.id)}
                >
                  Settle
                </button>
              )}
            </span>

          </div>
        ))}
    </div>

  </div>
);
}

export default App;