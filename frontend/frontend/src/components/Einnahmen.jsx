import React from "react";
import { Line, Bar } from "react-chartjs-2";
import styles from "./Einnahmen.module.css";

const Einnahmen = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Einnahmenentwicklung",
        data: [400, 500, 450, 700, 800, 750, 900],
        backgroundColor: "rgba(0, 194, 255, 0.2)",
        borderColor: "rgb(0, 194, 255)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monatliche Einnahmen",
        data: [8000, 3000, 6000, 7000, 4000, 8000, 3000, 7000, 4000, 8000, 6000, 3000],
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className={styles.einnahmenDashboard}>
      <div className={styles.card}>
        <h3>Gesamteinnahmen</h3>
        <h1>61.580,04 €</h1>
        <p style={{ color: "green" }}>↑ 11.94%</p>
        <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <div className={styles.card}>
        <h3>Einnahmen</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default Einnahmen;
