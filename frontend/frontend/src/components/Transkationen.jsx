import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";
import { createCompanyExpense, fetchCompanyExpense } from "../apiService";

const Transaktionen = () => {

  const [transactions, setTransactions] = useState([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false); // Zustand für das Upload-Menü
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    date_purchased: "01.01.2025",
    cost: 0,
    paymentMethod: "CA", // Standardwert
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


  // Daten für die Line-Charts
  const totalExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Gesamtaufwand",
        data: [300, 400, 500, 450, 550, 600, 680],
        borderColor: "rgb(255, 0, 132)",
        backgroundColor: "rgba(255, 0, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const profitData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Gewinn",
        data: [500, 600, 700, 750, 800, 850, 900],
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
  const handleAddTransaction = () => {
    if (
      newTransaction.title &&
      newTransaction.date &&
      newTransaction.amount &&
      newTransaction.handler
    ) {
      let response = createCompanyExpense(newTransaction)
      if(response.status = 200) {
        window.alert('Upload successfull')
        setTransactions([])
        setTransactions(response.data)
      }
      setShowUploadMenu(false);
      setNewTransaction({
        title: "",
        description: "",
        date: "",
        amount: 0,
        handler: "",
        category: Object.keys(expense_categories)[1],
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
          <h1>678,72 €</h1>
          <p style={{ color: "red" }}>↑ 19.91%</p>
          <Line data={totalExpenseData} options={chartOptions} />
        </div>
        <div className={styles.card}>
          <h3>Gewinn</h3>
          <h1>5.479,32 €</h1>
          <p style={{ color: "green" }}>↑ 21.17%</p>
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
              <tr key={index} className={styles.transactionItem}>
                <td>{transaction.title}</td>
                <td>{transaction.date}</td>
                <td>{payment_types[transaction.payment_type]}</td>
                <td>{transaction.handler}</td>
                <td
                  style={{ color: transaction.amount > 0 ? "green" : "red" }}
                  className={styles.transactionAmount}
                >
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload-Menü */}
      {showUploadMenu && (
        <div className={styles.uploadMenu}>
          <h3>Neue Transaktion hinzufügen</h3>
          <input
            type="text"
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
            placeholder="Datum"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Betrag in Cent (-2000 für -20€)"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
          />
          <select
            value={newTransaction.payment_type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, payment_type: e.target.value })
            }
          >
            
            {Object.entries(payment_types).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
          </select>
          <select
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
          >
            {Object.entries(expense_categories).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
            
          </select>
          <input
            type="text"
            placeholder="Bearbeiter"
            value={newTransaction.handler}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, handler: e.target.value })
            }
          />
          <div className={styles.uploadMenuActions}>
            <button onClick={handleAddTransaction}>Hinzufügen</button>
            <button onClick={() => setShowUploadMenu(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaktionen;
