import React from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Ausgaben.css"; // Importiere das Stylesheet

// Module registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Ausgaben = () => {
  // Daten für das Line Chart
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Ausgabenentwicklung",
        data: [300, 400, 350, 500, 700, 600, 800],
        backgroundColor: "rgba(255, 0, 132, 0.2)",
        borderColor: "rgb(255, 0, 132)",
        borderWidth: 2,
      },
    ],
  };

  // Daten für das Bar Chart
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Monatliche Ausgaben",
        data: [7000, 6000, 7500, 8000, 5000, 9000, 6500, 8000, 7000],
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = { responsive: true, plugins: { legend: { display: false } } };

  // Ausgaben-Liste
  const expenses = [
    { category: "Getränke", date: "13 Oktober 2024", amount: "-160,51 €" },
    { category: "Lebensmittel", date: "13 Oktober 2024", amount: "-432,39 €" },
    { category: "Gastraum", date: "23 September 2024", amount: "-52,45 €" },
    { category: "Verbrauch", date: "09 Juli 2024", amount: "-33,37 €" },
  ];

  return (
    <div className="expenses-dashboard">
      {/* Gesamtausgaben & Line Chart */}
      <div className="top-section">
        <div className="card total-expenses">
          <h3>Gesamtausgaben</h3>
          <h1>678,72 €</h1>
          <p style={{ color: "red" }}>↑ 19.91%</p>
          <Line data={lineData} options={chartOptions} />
        </div>

        {/* Ausgaben-Liste */}
        <div className="card expense-list">
          <h3>Ausgaben</h3>
          <ul>
            {expenses.map((item, index) => (
              <li key={index} className="expense-item">
                <div>
                  <strong>{item.category}</strong>
                  <p>{item.date}</p>
                </div>
                <span style={{ color: "red" }}>{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bottom-section">
        <div className="card bar-chart">
          <h3>Ausgaben</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Ausgaben;
