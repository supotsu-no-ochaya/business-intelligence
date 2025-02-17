import React, { useState, useEffect } from 'react';
import styles from './Lager.module.css';
import { fetchLagerItems, fetchIngredients, fetchLocation, PutLagerItems, PutIngredients, PutLocation } from '../apiService';

const Lager = () => {
  const [data, setData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lagerResponse, ingredientsResponse, locationsResponse] = await Promise.all([
          fetchLagerItems(),
          fetchIngredients(),
          fetchLocation(),
        ]);
  
        const ingredients = ingredientsResponse.data || ingredientsResponse;
        const locations = locationsResponse.data || locationsResponse;
  
        console.log('Locations:', locations); // Debugging: Zeige die Struktur der Lagerorte
  
        setIngredients(ingredients);
        setLocations(locations);
  
        const transformedData = lagerResponse.data.map((item) => {
          const ingredient = ingredients.find((ing) => ing.id === item.name_ingredient);
          const location = locations.find((loc) => loc.id === item.location);
  
          const haben = item.total_stock ?? 0; // Total Stock vom Lager
          const brauchen = ingredient?.base_stock ?? 0; // Base Stock von der Zutat
  
          return {
            id: item.id, // Lokale ID
            name_ingredient: item.name_ingredient, // Backend erwartet das
            location: location ? location.name_loc : item.location, // Lagerort-Name
            name: ingredient ? ingredient.name_ing : `Zutat ${item.name_ingredient}`,
            haben, // "Haben" aus total_stock
            brauchen, // "Brauchen" aus base_stock
            missing: Math.max(0, brauchen - haben), // Fehlende Menge berechnen
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

  const saveChanges = async () => {
    try {
      for (const item of data) {
        // Lagerort-ID anhand des Namens finden
        const selectedLocation = locations.find((loc) => loc.name_loc === item.location);
  
        if (!selectedLocation) {
          console.error(`Lagerort nicht gefunden für: ${item.location}`);
          alert(`Fehler: Lagerort "${item.location}" wurde nicht gefunden.`);
          continue; // Überspringe dieses Item
        }
  
        const formattedData = {
          total_stock: item.haben, // "haben" wird zu total_stock
          name_ingredient: item.name_ingredient || item.id, // ID der Zutat oder Name der Zutat
          location: selectedLocation.id, // Lagerort-ID
          unit: item.unit, // Einheit
        };
  
        const ingredientData = {
          base_stock: item.brauchen, // "brauchen" wird zu base_stock
          name_ing: item.name, // Name der Zutat
        };
  
        console.log(`Daten für PUT für Ingredient (ID: ${item.name_ingredient}):`, ingredientData);
        console.log(`Daten für PUT (ID: ${item.id}):`, formattedData);
  
        // API-Aufruf mit der ID in der URL für das Lageritem
        const lagerResponse = await PutLagerItems(item.id, formattedData);
        console.log('Lager Item gespeichert:', lagerResponse);
  
        // API-Aufruf für die Zutat (base_stock aktualisieren)
        const ingredientResponse = await PutIngredients(item.name_ingredient, ingredientData);
        console.log('Ingredient gespeichert:', ingredientResponse);
      }
  
      alert('Änderungen erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Änderungen:', error);
      alert('Fehler beim Speichern der Änderungen.');
    }
  };
  
  const calculateMissingItems = () => {
    return data
      .filter((item) => item.haben < item.brauchen)
      .map((item) => ({
        name: item.name,
        missing: item.brauchen - item.haben,
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
        <button onClick={saveChanges} className={styles['save-button']}>
          Änderungen speichern
        </button>
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
                    style={{ width: `${(item.haben / item.brauchen) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles['input-group']}>
                <input
                  type="number"
                  min="0"
                  className={styles['number-input']}
                  value={item.haben}
                  onChange={(e) => handleInputChange(index, 'haben', e.target.value)}
                />
                /
                <input
                  type="number"
                  min="0"
                  className={styles['number-input']}
                  value={item.brauchen}
                  onChange={(e) => handleInputChange(index, 'brauchen', e.target.value)}
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