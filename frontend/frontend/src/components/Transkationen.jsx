import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";
import { createCompanyExpense, fetchCompanyExpense} from "../apiService";

const Transaktionen = () => {

  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([])
  const [showUploadMenu, setShowUploadMenu] = useState(false); // Zustand für das Upload-Menü
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    date_purchased: "",
    cost: 0,
    paymentMethod: "",
    handler: "",
  });

  useEffect(() => {
    // Define an async function to fetch data
    const fetchTransactions = async () => {
      try {
        const expense_data = await fetchCompanyExpense()
        // Assuming the API returns an array of transactions
        setTransactions(expense_data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array ensures this runs once when component mounts

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

  const calculateExpenseData = (transactions) => {
    const expense_data = {};

    transactions.forEach(({ date, amount }) => {
      const [year, month] = date.split("-");
      if (!expense_data[year]) expense_data[year] = Array(months.length).fill(0);
      expense_data[year][month - 1] += amount;
    });

    return expense_data;
  };

  // Helper function to calculate accumulated expense data
  const calculateAccumulatedData = (expenseData) => {
    const accumulatedData = {};
    let cumulativeTotal = 0;

    Object.keys(expenseData)
      .sort()
      .forEach((year) => {
        accumulatedData[year] = Array(months.length).fill(0);

        for (let i = 0; i < months.length; i++) {
          cumulativeTotal += expenseData[year][i];
          accumulatedData[year][i] = cumulativeTotal;
        }
      });

    return accumulatedData;
  };

  function convertToEuro(amount_in_cents) {
    return (amount_in_cents/100).toFixed(2)
  }

  // Generate data for charts
  const expenses = calculateExpenseData(transactions);
  const accumulated_expenses = calculateAccumulatedData(expenses);

  const earnings = {2025: []}
  const accumulated_earnings = {2025: []}

  var most_recent_year = Math.max(...Object.keys(accumulated_expenses))
  
  console.log('expenses:', expenses[most_recent_year])
  console.log('order earnings:', earnings[most_recent_year])
  const total_expenses = convertToEuro(
    expenses[most_recent_year]?.reduce((sum, val) => sum + val, 0) || 0
  )
  const total_order_earnings = convertToEuro(
    earnings[most_recent_year]?.reduce((sum, val) => sum + val, 0) || 0
  )

  // Daten für die Line-Charts
  const totalExpenseData = {
    labels: months,
    datasets: [
      {
        label: "Gesamtaufwand",
        data: accumulated_expenses[most_recent_year]?.map(elem => (elem*(-1))/100) || [], // invert numbers to get "growing expenses"
        borderColor: "rgb(255, 0, 132)",
        backgroundColor: "rgba(255, 0, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const profitData = {
    labels: months,
    datasets: [
      {
        label: "Gewinn",
        data: accumulated_earnings[most_recent_year]?.map(elem => (elem*(-1))/100) || [], // invert numbers to get "growing expenses",
        borderColor: "rgb(0, 255, 132)",
        backgroundColor: "rgba(0, 255, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(255, 255, 255, 0.1)" } },
    },
  };


  const expense_categories = {
    'FOOD': 'Essen & Getränke',
    'DECOR': 'Dekorationen',
    'COSTUME': 'Kostüme',
    'PROMO': 'Werbung & Promotion',
    'SUPPLY': 'Materialien',
    'EQUIP': 'Ausrüstung',
    'TRAVEL': 'Reisekosten',
    'FEES': 'Gebühren & Lizenzen',
    'MISC': 'Sonstiges',
  }

  const payment_types = {
    'CC': 'Kreditkarte',
    'CA': 'Bargeld'
  }

  // Funktion zum Hinzufügen einer neuen Transaktion
  const handleAddTransaction = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log(event);
    
    if (
      newTransaction.title &&
      newTransaction.date &&
      newTransaction.amount &&
      newTransaction.handler
    ) {
      let response = createCompanyExpense(newTransaction)
      if(response.status === 200) {
        setTransactions({
          ...transactions,
          ...response.data
        })
        window.alert('Upload successfull')
      }
      setShowUploadMenu(false);
      setNewTransaction({
        title: "",
        description: "",
        date: "",
        amount: 0,
        handler: "",
        category: "",
        payment_type: ""
      }); // Formular zurücksetzen
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Obere Karten */}
      <div className={styles.topCards}>
        <div className={styles.card}>
          <h3>Gesamtaufwand</h3>
          <h1>{total_expenses} €</h1>
          {/* <p style={{ color: "red" }}>↑ 19.91%</p> */}
          <Line data={totalExpenseData} options={chartOptions} />
        </div>
        <div className={styles.card}>
          <h3>Gewinn</h3>
          <h1>{total_order_earnings} €</h1>
          {/* <p style={{ color: "green" }}>↑ 21.17%</p> */}
          <Line data={profitData} options={chartOptions} />
        </div>
      </div>

      {/* Transaktionen */}
      <div className={styles.transactions}>
        <h3>Transaktionen</h3>
        <button
          className={styles.uploadButton}
          onClick={() => setShowUploadMenu(true)}
        >
          Transaktion hochladen
        </button>
        <table className={styles.transactionList}>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Datum</th>
              <th>Zahlungsart</th>
              <th>Bearbeiter</th>
              <th>Betrag</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className={styles.transactionItem}>
                <td>{transaction.title}</td>
                <td>{transaction.date}</td>
                <td>{payment_types[transaction.payment_type]}</td>
                <td>{transaction.handler}</td>
                <td
                  style={{ color: transaction.amount > 0 ? "green" : "red" }}
                  className={styles.transactionAmount}
                >
                  {(transaction.amount / 100).toFixed(2).replace('.', ',')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload-Menü */}
      {showUploadMenu && (
        <form className={styles.uploadMenu} onSubmit={handleAddTransaction}>
          <h3>Neue Transaktion hinzufügen</h3>
          <input
            type="text"
            required
            placeholder="Titel"
            value={newTransaction.title}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Beschreibung"
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, description: e.target.value })
            }
          />
          <input
            type="date"
            required
            placeholder="Datum"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />
          <input
            type="number"
            required
            placeholder="Betrag in Cent (-2000 für -20€)"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
          />
          <select
            value={newTransaction.payment_type}
            required
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, payment_type: e.target.value })
            }
          >
            <option value="default" selected disabled>Select payment type</option>
            {Object.entries(payment_types).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
          </select>
          <select
            value={newTransaction.category}
            required
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
          >
            <option value="default" selected disabled>Select category</option>
            {Object.entries(expense_categories).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
            
          </select>
          <input
            type="text"
            required
            placeholder="Bearbeiter"
            value={newTransaction.handler}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, handler: e.target.value })
            }
          />
          <div className={styles.uploadMenuActions}>
            <button type="submit">Hinzufügen</button>
            <button onClick={() => setShowUploadMenu(false)}>Abbrechen</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Transaktionen;
