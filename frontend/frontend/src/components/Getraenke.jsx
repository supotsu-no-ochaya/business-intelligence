import React from 'react';
import styles from './Getraenke.module.css';

const Getraenke = () => {
  const data = [
    { name: 'Apfelschorle', total: 5, used: 5 },
    { name: 'Cola', total: 8, used: 6 },
    { name: 'Fanta', total: 2, used: 1 },
    { name: 'Sprite', total: 2, used: 1 },
    { name: 'Wasser', total: 5, used: 4 },
    { name: 'Kaffe', total: 7, used: 5 },
    { name: 'Tee', total: 7, used: 5 },
    { name: 'Milch', total: 2, used: 2 },
    { name: 'Kakao', total: 3, used: 2 },
    { name: 'Matcha', total: 7, used: 5 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles['analytics-card']}>
        <h2 className={styles.header}>Getränke Analytics</h2>
        
        {/* Dropdown für "Letztes Event" */}
        <select className="dropdown">
          <option>Letzter Monat</option>
          <option>Alle Monate</option>
        </select>

        <ul className={styles['analytics-list']}>
          {data.map((item, index) => (
            <li key={index} className={styles['list-item']}>
              <span className={styles['item-name']}>{item.name}</span>
              <div className={styles['progress-container']}>
                <div className={styles['progress-bar']}>
                  <div
                    className={styles['progress-used']}
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  ></div>
                </div>
                <span className={styles['values']}>{item.used} / {item.total}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles['total-section']}>
          <span>Total:</span>
          <span className={styles['total-amount']}>$17,355</span>
        </div>
      </div>
    </div>
  );
};

export default Getraenke;