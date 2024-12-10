import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Verkaufszahlen.module.css';

const Verkaufszahlen = () => {
  const [speisen, setSpeisen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API-Call im useEffect
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/total_earnings'); // API-Endpoint aufrufen
        setSpeisen(response.data); // Daten aus der API setzen
      } catch (err) {
        setError('Fehler beim Abrufen der Verkaufszahlen');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getraenke = [
    { name: 'Cola', sales: 108 },
    { name: 'Kakao', sales: 92 },
    { name: 'Kaffee', sales: 62 },
  ];

  const maxSalesSpeisen = Math.max(...speisen.map(item => item.sales), 0);
  const maxSalesGetraenke = Math.max(...getraenke.map(item => item.sales));

  const renderCategory = (data, maxSales, title) => (
    <div className={styles.salesCard}>
      <div className={styles.salesHeader}>
        <h2>Verkaufsschlager</h2>
        <div className={styles.filters}>
          <div className={styles.filter}>Gesamter Zeitraum</div>
          <div className={styles.filter}>Top Produkte</div>
        </div>
      </div>

      <div className={styles.salesCategory}>
        <h3>{title}</h3>
        {data.map((item, index) => (
          <div key={index} className={styles.salesRow}>
            <span className={styles.itemName}>{item.name}</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(item.sales / maxSales) * 100}%`,
                }}
              >
                <span className={styles.progressText}>{item.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.salesFooter}>
        <span>Total</span>
        <span className={styles.totalAmount}>6,158.04 €</span>
      </div>
    </div>
  );

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.salesDashboard}>
      {renderCategory(speisen, maxSalesSpeisen, 'Speisen')}
      {renderCategory(getraenke, maxSalesGetraenke, 'Getränke')}
    </div>
  );
};

export default Verkaufszahlen;
