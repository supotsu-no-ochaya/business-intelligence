import React, { useState, useEffect } from 'react';
import styles from './Lager.module.css';
import { fetchLagerItems, fetchIngredients, fetchLocation } from '../apiService';

const Lager = () => {
  const [data, setData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Daten von allen APIs abrufen
        const [lagerResponse, ingredientsResponse, locationsResponse] = await Promise.all([
          fetchLagerItems(),
          fetchIngredients(),
          fetchLocation(),
        ]);

        console.log('Lager Response:', lagerResponse);
        console.log('Ingredients Response:', ingredientsResponse);
        console.log('Locations Response:', locationsResponse);

        // Extrahiere die Arrays aus den API-Antworten
        const ingredients = ingredientsResponse.data || ingredientsResponse;
        const locations = locationsResponse.data || locationsResponse;

        // Zutaten und Lagerorte in den Zustand speichern
        setIngredients(ingredients);
        setLocations(locations);

        // Lagerdaten transformieren
        const transformedData = lagerResponse.data.map((item) => {
          const ingredient = ingredients.find((ing) => ing.id === item.name_ingredient);
          const location = locations.find((loc) => loc.id === item.location);

          const haben = item.total_stock ?? 0; // Total Stock vom Lager
          const brauchen = ingredient?.base_stock ?? 0; // Base Stock von der Zutat

          return {
            id: item.id,
            name: ingredient ? ingredient.name_ing : `Zutat ${item.name_ingredient}`,
            haben, // "Haben" aus total_stock
            brauchen, // "Brauchen" aus base_stock
            missing: Math.max(0, brauchen - haben), // Fehlende Menge berechnen
            location: location ? location.name_loc : `Lager ${item.location}`,
            unit: item.unit,
          };
        });

        setData(transformedData);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = field === 'total' || field === 'used' ? parseInt(value, 10) : value;
    setData(updatedData);
  };

  const calculateMissingItems = () => {
    return data
      .filter((item) => item.used < item.haben) // Hier mit "haben" anstelle von "total"
      .map((item) => ({
        name: item.name,
        missing: item.haben - item.used, // Fehlende Menge berechnen
        location: item.location,
      }));
  };

  const downloadShoppingList = () => {
    const missingItems = calculateMissingItems();
    const csvContent = [
      ['Artikel', 'benoetigte Menge', 'Lagerort'].join(';'),
      ...missingItems.map((item) => `${item.name};${item.missing};${item.location}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'einkaufsliste.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles['analytics-card']}>
        <h2 className={styles.header}>Lager</h2>
        <button onClick={downloadShoppingList} className={styles['download-button']}>
          Einkaufsliste herunterladen
        </button>

        <ul className={styles['analytics-list']}>
          {data.map((item, index) => (
            <li key={item.id} className={styles['list-item']}>
              <span className={styles['item-name']}>{item.name}</span>
              <div className={styles['progress-wrapper']}>
                <div className={styles['progress-bar']}>
                  <div
                    className={styles['progress-used']}
                    style={{ width: `${(item.used / item.haben) * 100}%` }} // Fortschritt anhand von "haben"
                  ></div>
                </div>
              </div>
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
                  value={item.haben}
                  onChange={(e) => handleInputChange(index, 'haben', e.target.value)} // Anpassen für "haben"
                />
              </div>
              <select
                className={styles['location-dropdown']}
                value={item.location}
                onChange={(e) => handleInputChange(index, 'location', e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name_loc}>
                    {loc.name_loc}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lager;
