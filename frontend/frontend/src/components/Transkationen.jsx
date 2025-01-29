import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";
import { createCompanyExpense, fetchCompanyExpense, fetchOrders} from "../apiService";

import {
  Chart as ChartJS,
  CategoryScale, // Required for "category" scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Transaktionen = () => {
  const current_year = (new Date().getFullYear())

  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([])
  const [selected_year, setSelectedYear] = useState(current_year)
  const [showUploadMenu, setShowUploadMenu] = useState(false); // Zustand für das Upload-Menü
  const [newTransaction, setNewTransaction] = useState({});
  const [dateError, setDateError] = useState('');
  const [amountError, setAmountError] = useState('');

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
  function calculateAccumulatedData(expenseData) {
    const accumulatedData = {};
    
    Object.keys(expenseData)
      .sort()
      .forEach((year) => {
        accumulatedData[year] = Array(months.length).fill(0);
        let cumulativeTotal = 0;

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
  const earnings_orders = orders.map(order => ({'date': order.created, 'amount': order.menu_item_price_in_cents}))

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

  let y_lim_chart = 0
  if(accumulated_earnings_data[selected_year] && accumulated_expenses[selected_year]) {
    y_lim_chart = Math.max(accumulated_earnings_data[selected_year][accumulated_earnings_data[selected_year].length-1], accumulated_expenses[selected_year][accumulated_expenses[selected_year].length-1])
    y_lim_chart /= 100 
    y_lim_chart += y_lim_chart * 0.1
    y_lim_chart = Math.ceil(y_lim_chart / 50) * 50 // round y limit to the next 50 for nicer numbers
  }

  // Daten für die Line-Charts
  const totalExpenseData = {
    labels: months,
    datasets: [
      {
        label: "Gesamtaufwand",
        data: accumulated_expenses[selected_year]?.map(elem => elem/100) || [],
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
        data: accumulated_earnings_data[selected_year]?.map(elem => elem/100) || [],
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
      y: { grid: { color: "rgba(255, 255, 255, 0.1)" }, min: 0, max: y_lim_chart },
    },
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    const selectedDate = new Date(value).getTime();
    const currentDate = Date.now();

    if (selectedDate > currentDate) {
      setDateError('Achtung: Datum liegt in der Zukunft'); // "Date is in the future"
    } else {
      setDateError('');
    }

    setNewTransaction({ ...newTransaction, date: e.target.value })
  };

  // Funktion zum Hinzufügen einer neuen Transaktion
  const handleAddTransaction = async (event) => {
    event.preventDefault(); // Prevent page reload
    if (
      newTransaction.title &&
      newTransaction.type &&
      newTransaction.date &&
      newTransaction.amount &&
      newTransaction.payment_type &&
      newTransaction.category &&
      newTransaction.handler
    ) {
      newTransaction.amount = newTransaction.amount * 100 // turn to cents
      let response = await createCompanyExpense(newTransaction)
      console.log(response)
      if(response.status >= 200 && response.status < 300) {
        setTransactions([
          ...response.data,
        ])
        window.alert('Upload successfull')
      }
      setShowUploadMenu(false);
      setNewTransaction({
      }); // Formular zurücksetzen
    }
  };

  const availableYears = Object.keys(accumulated_earnings_data).includes(current_year.toString()) ? Object.keys(accumulated_earnings_data) : Object.keys(accumulated_earnings_data).concat(current_year).sort((a,b) => a < b)
  
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
          <select defaultValue={""}
            value={newTransaction.type}
            required
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
          >
            <option value="" disabled>--Einnahme/Ausgabe auswählen--</option>
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
          <div className={styles.dateSelectField}>
            <input
              type="date"
              required
              placeholder="Datum"
              value={newTransaction.date}
              onChange={handleDateChange}
            />
            <span className={styles.errorField}>{dateError}</span>
          </div>
          <div className={styles.amountField}>
            <span>
            <input
              type="number"
              min={0.1}
              step="0.01"
              required
              placeholder="Betrag (in €)"
              value={newTransaction.amount}
              onChange={e => {
                  if(e.target.value < 0) {
                    setAmountError('Achtung: Bei Ausgaben bitte die Transaktionsart "' + expense_types["E"] +'" nutzen und postitven Wert eintragen')
                  } else {
                    setAmountError('')
                  }
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
              }
            />€</span>
            <span className={styles.errorField}>{amountError}</span>
          </div >
          <select
            value={newTransaction.payment_type}
            required
            defaultValue={""}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, payment_type: e.target.value })
            }
          >
            <option value=""  disabled>--Zahlungsart auswählen--</option>
            {Object.entries(payment_types).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
          </select>
          <select
            value={newTransaction.category}
            defaultValue={""}
            required
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
          >
            <option value="" disabled>--Kategorie auswählen--</option>
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
