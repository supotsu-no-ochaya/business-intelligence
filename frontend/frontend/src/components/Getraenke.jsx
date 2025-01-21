import React, { useState } from 'react';
import styles from './Getraenke.module.css';

const Getraenke = () => {
  const [data, setData] = useState([
    { name: 'Apfelschorle', total: 5, used: 5, location: 'Lager 1' },
    { name: 'Cola', total: 8, used: 6, location: 'Lager 1' },
    { name: 'Fanta', total: 2, used: 1, location: 'Lager 2' },
    { name: 'Sprite', total: 2, used: 1, location: 'Lager 2' },
    { name: 'Wasser', total: 5, used: 4, location: 'Lager 3' },
    { name: 'Kaffe', total: 7, used: 5, location: 'Lager 1' },
    { name: 'Tee', total: 7, used: 5, location: 'Lager 1' },
    { name: 'Milch', total: 2, used: 2, location: 'Lager 2' },
    { name: 'Kakao', total: 3, used: 2, location: 'Lager 3' },
    { name: 'Matcha', total: 7, used: 5, location: 'Lager 3' },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = field === 'total' || field === 'used' ? parseInt(value, 10) : value;
    setData(updatedData);
  };

  return (
    <div className={styles.container}>
      <div className={styles['analytics-card']}>
        <h2 className={styles.header}>Getränke Analytics</h2>
  
        <ul className={styles['analytics-list']}>
          {data.map((item, index) => (
            <li key={index} className={styles['list-item']}>
              {/* Getränkename */}
              <span className={styles['item-name']}>{item.name}</span>
  
              {/* Progress Bar */}
              <div className={styles['progress-wrapper']}>
                <div className={styles['progress-bar']}>
                  <div
                    className={styles['progress-used']}
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
  
              {/* Ist und Soll Inputs */}
              <div className={styles['input-group']}>
                <input
                  type="number"
                  min="0"
                  className={styles['number-input']}
                  value={item.used}
                  onChange={(e) => handleInputChange(index, 'used', e.target.value)}
                />
                /
                <input
                  type="number"
                  min="0"
                  className={styles['number-input']}
                  value={item.total}
                  onChange={(e) => handleInputChange(index, 'total', e.target.value)}
                />
              </div>
  
              {/* Lagerort Dropdown */}
              <select
                className={styles['location-dropdown']}
                value={item.location}
                onChange={(e) => handleInputChange(index, 'location', e.target.value)}
              >
                <option value="Lager 1">Lager 1</option>
                <option value="Lager 2">Lager 2</option>
                <option value="Lager 3">Lager 3</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}  

export default Getraenke;
