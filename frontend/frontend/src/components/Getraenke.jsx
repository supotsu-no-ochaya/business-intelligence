import React from 'react';
import styles from './Getraenke.module.css';

const Getraenke = () => {
  const data = [
    { name: 'Kaffe', total: 7, used: 5 },
    { name: 'Apfelschorle', total: 5, used: 5 },
    { name: 'Müllbeutel (60L)', total: 8, used: 6 },
    { name: 'Messer (Holz)', total: 2, used: 1 },
    { name: 'Gabel (Holz)', total: 2, used: 1 },
    { name: 'Papier Teller', total: 5, used: 4 },
    { name: 'Servietten (klein/weiß)', total: 7, used: 5 },
    { name: 'Servietten (groß)', total: 2, used: 2 },
    { name: 'Mochi Formen', total: 3, used: 2 },
    { name: 'Flächendesinfektion', total: 10, used: 3 },
    { name: 'Spülmittel', total: 7, used: 5 },
  ];

  return (
    <div className={styles['analytics-card']}>
      <div className={styles['analytics-header']}>
        <h2>Analytics</h2>
        <div className={styles['dropdown']}>
          <span>Last Month</span>
          <span className={styles['arrow']}>▼</span>
        </div>
      </div>

      <div className={styles['analytics-table']}>
        {data.map((item, index) => (
          <div key={index} className={styles['table-row']}>
            <span className={styles['item-name']}>{item.name}</span>
            <div className={styles['progress-bar']}>
              <div
                className={styles['progress-used']}
                style={{
                  width: `${(item.used / item.total) * 100}%`,
                }}
              >
                <span className={styles['progress-text']}>{item.used}</span>
              </div>
            </div>
            <span>{item.total}</span>
          </div>
        ))}
      </div>

      <div className={styles['analytics-footer']}>
        <span>Total</span>
        <span className={styles['total-amount']}>$17,355</span>
      </div>
    </div>
  );
};

export default Getraenke;
