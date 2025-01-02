import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./Transaktionen.module.css";

const Transaktionen = () => {
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
  const transactions = [
    { title: "Metro Einkauf", date: "13 Oktober 2024", amount: "-678,72 €", type: "expense" },
    { title: "Standmiete", date: "10 Oktober 2024", amount: "-100,00 €", type: "expense" },
    { title: "Einnahmen Messe", date: "23 September 2023", amount: "+6.158,04 €", type: "income" },
    { title: "Kontoführungsgebühren", date: "09 Juli 2023", amount: "-6,50 €", type: "expense" },
  ];

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
        <ul className={styles.transactionList}>
          {transactions.map((transaction, index) => (
            <li key={index} className={styles.transactionItem}>
              <div>
                <strong>{transaction.title}</strong>
                <p>{transaction.date}</p>
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
    </div>
  );
};

export default Transaktionen;
