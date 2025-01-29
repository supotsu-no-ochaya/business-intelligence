import React, { useState, useEffect } from 'react';
import styles from './IngredientUsage.module.css';
import { fetchIngredientUsage, fetchEvents } from '../apiService'; // API-Service importieren

const IngredientUsage = () => {
  const [ingredientUsageData, setIngredientUsageData] = useState([]); // Initialisiere mit leerem Array
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState([]); // Events aus der API
  const [selectedEvent, setSelectedEvent] = useState('all'); // State für ausgewähltes Event
  const [error, setError] = useState('');

  // API-Aufruf mit dem eingegebenen Datum
  const handleApply = async () => {
    if (!startDate || !endDate) {
      setError('Bitte wählen Sie Start- und Enddatum aus.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Startdatum darf nicht nach dem Enddatum liegen
    if (start > end) {
      setError('Das Startdatum darf nicht nach dem Enddatum liegen.');
      return;
    }

    // Enddatum darf nicht in der Zukunft liegen
    if (end > today) {
      setError('Das Enddatum darf nicht in der Zukunft liegen.');
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

  // Events beim Laden der Seite aus API abrufen
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Fehler beim Laden der Events:', error);
      }
    };
    loadEvents();
  }, []);

  // Auswahl eines Events -> Start- und Enddatum setzen
  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);

    if (eventId === 'all') {
      // Falls "Alle Events" gewählt wurde, Felder leeren
      setStartDate('');
      setEndDate('');
    } else {
      // Passendes Event suchen
      const event = events.find((e) => e.id === parseInt(eventId));
      if (event) {
        setStartDate(event.start_date);
        setEndDate(event.end_date);
      }
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

          {/* Dropdown für Events (verschoben nach dem Date-Picker) */}
          <select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            className={styles.dropdown}
          >
            <option value="all">Alle Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.start_date} - {event.end_date})
              </option>
            ))}
          </select>
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
