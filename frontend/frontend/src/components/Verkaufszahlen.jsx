import React from 'react';
import styles from './Verkaufszahlen.module.css';

const Verkaufszahlen = () => {
  const speisen = [
    { name: 'Sandwich Käse Schinken', sales: 142 },
    { name: 'Nutella Crepe', sales: 96 },
    { name: 'Thun Onigiri', sales: 96 },
    { name: 'Hack Onigiri', sales: 85 },
  ];

  const getraenke = [
    { name: 'Cola', sales: 108 },
    { name: 'Kakao', sales: 92 },
    { name: 'Kaffee', sales: 62 },
  ];

  const maxSalesSpeisen = Math.max(...speisen.map(item => item.sales));
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

  return (
    <div className={styles.salesDashboard}>
      {renderCategory(speisen, maxSalesSpeisen, 'Speisen')}
      {renderCategory(getraenke, maxSalesGetraenke, 'Getränke')}
    </div>
  );
};

export default Verkaufszahlen;
