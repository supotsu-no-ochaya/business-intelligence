import React, { useState } from 'react';
import styles from './IngredientUsage.module.css';
import { fetchIngredientUsage } from '../apiService'; // API-Service importieren

const IngredientUsage = () => {
  const [ingredientUsageData, setIngredientUsageData] = useState([]); // Initialisiere mit leerem Array
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // API-Aufruf mit dem eingegebenen Datum
  const handleApply = async () => {
    if (!startDate || !endDate) {
      setError('Bitte wählen Sie Start- und Enddatum aus.');
      return;
    }

    // Startdatum darf nicht nach dem Enddatum liegen
    if (new Date(startDate) > new Date(endDate)) {
      setError('Das Startdatum darf nicht nach dem Enddatum liegen.');
      return;
    }

    try {
      setError('');
      const data = await fetchIngredientUsage(startDate, endDate);
      setIngredientUsageData(Array.isArray(data) ? data : []); // Sicherstellen, dass ein Array kommt
    } catch (err) {
      setError('Fehler beim Abrufen der Daten. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['dashboard-card']}>
        <h2 className={styles.header}>Zutatenverbrauch</h2>

        {/* Date-Picker für Zeitraum */}
        <div className={styles['date-picker-container']}>
          <input
            type="date"
            className={styles['date-picker']}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={styles['date-picker']}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className={styles['apply-button']} onClick={handleApply}>
            Anwenden
          </button>
        </div>

        {/* Fehleranzeige */}
        {error && <p className={styles['error-message']}>{error}</p>}

        {/* Zutatenverbrauch-Anzeige */}
        <ul className={styles['analytics-list']}>
          {ingredientUsageData.length > 0 ? (
            ingredientUsageData.map((ingredient, index) => (
              <li key={index} className={styles['list-item']}>
                <span className={styles['item-name']}>{ingredient.ingredient_name}</span>
                <div className={styles['progress-wrapper']}>
                  <div className={styles['progress-bar']}>
                    <div
                      className={styles['progress-used']}
                      style={{ width: `${(ingredient.quantity_used / 100) * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles['progress-values']}>
                    {ingredient.quantity_used} {ingredient.unit}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className={styles['no-data']}>
              Keine Daten verfügbar. Wählen Sie einen Zeitraum und klicken Sie auf "Anwenden".
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default IngredientUsage;
