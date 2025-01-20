import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";
import { createCompanyExpense, fetchCompanyExpense, fetchOrders} from "../apiService";

const Transaktionen = () => {
  const current_year = (new Date().getFullYear())

  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([])
  const [selected_year, setSelectedYear] = useState(current_year)
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

  useEffect(() => {
    // Define an async function to fetch data
    const getOrders = async () => {
      try {
        const order_data = await fetchOrders()
        // Assuming the API returns an array of transactions
        setOrders(order_data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    getOrders();
  }, []); // Empty dependency array ensures this runs once when component mounts

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]

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

  const expense_types = {
    'I': 'Einkommen',
    'E': 'Ausgabe'
  }

  const calculateTransactionData = (transactions) => {
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
  const expenses = transactions.filter(item => item.type === 'E') // E => Expense 
  const expenses_data = calculateTransactionData(expenses);
  const accumulated_expenses = calculateAccumulatedData(expenses_data);

  const earnings_transactions = transactions.filter(item => item.type === 'I') // I => Income
  const earnings_orders = orders.map(order => new Object({'date': order.created, 'amount': order.menu_item_price_in_cents}))

  const combined_earnings = earnings_transactions.concat(earnings_orders)

  const earnings_data = calculateTransactionData(combined_earnings)
  const accumulated_earnings_data = calculateAccumulatedData(earnings_data)
  
  // setSelectedYear(Math.max(...Object.keys(accumulated_expenses)))

  const total_expenses = convertToEuro(
    expenses_data[selected_year]?.reduce((sum, val) => sum + val, 0) || 0
  )
  const total_order_earnings = convertToEuro(
    earnings_data[selected_year]?.reduce((sum, val) => sum + val, 0) || 0
  )


  // Daten für die Line-Charts
  const totalExpenseData = {
    labels: months,
    datasets: [
      {
        label: "Gesamtaufwand",
        data: accumulated_expenses[selected_year]?.map(elem => elem/100) || [], // invert numbers to get "growing expenses"
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
        data: accumulated_earnings_data[selected_year]?.map(elem => elem/100) || [], // invert numbers to get "growing expenses",
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

  const availableYears = Object.keys(accumulated_earnings_data).includes(current_year) ? Object.keys(accumulated_earnings_data) : Object.keys(accumulated_earnings_data).concat(current_year).sort((a,b) => a < b)

  return (
    <div className={styles.dashboard}>
      {/* Obere Karten */}
      <div className={styles.yearSelect}>
        <select name="" id="" onChange={(e) => setSelectedYear(e.target.value)}>
          
          {availableYears.map((year) => (
              <option value={year} key={year} >{year}</option>
          ))}
        </select>
      </div>
      <div className={styles.topCards}>
        <div className={styles.card}>
          <h3>Gesamtaufwand - {selected_year}</h3>
          <h1>{total_expenses} €</h1>
          {/* <p style={{ color: "red" }}>↑ 19.91%</p> */}
          <Line data={totalExpenseData} options={chartOptions} />
        </div>
        <div className={styles.card}>
          <h3>Gewinn - {selected_year}</h3>
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
                <td>{(new Date(transaction.date)).toLocaleDateString('de-DE')}</td>
                <td>{payment_types[transaction.payment_type]}</td>
                <td>{transaction.handler}</td>
                <td
                  style={{ color: transaction.type === 'I' ? "green" : "red" }}
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
          <select
            value={newTransaction.expense_type}
            required
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, expense_type: e.target.value })
            }
          >
            <option value="default" selected disabled>Ausgabe / Einkommen auswählen</option>
            {Object.entries(expense_types).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
          </select>
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
            placeholder="Betrag (in Cent)"
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
            <option value="default" selected disabled>Zahlungsart auswählen</option>
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
            <option value="default" selected disabled>Kategorie auswählen</option>
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
