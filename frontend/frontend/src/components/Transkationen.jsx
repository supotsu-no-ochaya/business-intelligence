import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";

const Transaktionen = () => {
  const [showUploadMenu, setShowUploadMenu] = useState(false); // Zustand für das Upload-Menü
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    date: "",
    amount: "",
    type: "income",
    paymentMethod: "Bar", // Standardwert
    handler: "",
  });

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

  // Transaktionsdaten
  const [transactions, setTransactions] = useState([
    {
      title: "Metro Einkauf",
      date: "13 Oktober 2024",
      amount: "-678,72 €",
      type: "expense",
      paymentMethod: "Kreditkarte",
      handler: "Max Mustermann",
    },
    {
      title: "Standmiete",
      date: "10 Oktober 2024",
      amount: "-100,00 €",
      type: "expense",
      paymentMethod: "Überweisung",
      handler: "Anna Schmidt",
    },
    {
      title: "Einnahmen Messe",
      date: "23 September 2023",
      amount: "+6.158,04 €",
      type: "income",
      paymentMethod: "Bar",
      handler: "Lisa Müller",
    },
  ]);

  // Funktion zum Hinzufügen einer neuen Transaktion
  const handleAddTransaction = () => {
    if (
      newTransaction.title &&
      newTransaction.date &&
      newTransaction.amount &&
      newTransaction.handler
    ) {
      setTransactions([
        ...transactions,
        {
          ...newTransaction,
          amount: `${newTransaction.type === "income" ? "+" : "-"}${newTransaction.amount} €`,
        },
      ]);
      setShowUploadMenu(false);
      setNewTransaction({
        title: "",
        date: "",
        amount: "",
        type: "income",
        paymentMethod: "Bar",
        handler: "",
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
        <ul className={styles.transactionList}>
          {transactions.map((transaction, index) => (
            <li key={index} className={styles.transactionItem}>
              <div>
                <strong>{transaction.title}</strong>
                <p>{transaction.date}</p>
                <p>Zahlungsart: {transaction.paymentMethod}</p>
                <p>Bearbeiter: {transaction.handler}</p>
              </div>
              <span
                style={{
                  color: transaction.type === "income" ? "green" : "red",
                }}
              >
                {transaction.amount}
              </span>
            </li>
          ))}
        </ul>
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
            type="date"
            placeholder="Datum"
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Betrag (€)"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
          />
          <select
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
          >
            <option value="income">Einnahme</option>
            <option value="expense">Ausgabe</option>
          </select>
          <select
            value={newTransaction.paymentMethod}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })
            }
          >
            <option value="Bar">Bar</option>
            <option value="Kreditkarte">Kreditkarte</option>
            <option value="Überweisung">Überweisung</option>
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
