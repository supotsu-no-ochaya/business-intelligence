import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders } from '../apiService'; // Importiere die API-Funktion

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedOrders = await fetchOrders(); // API-Daten abrufen
                setOrders(fetchedOrders);
                console.log(fetchedOrders); // Debugging-Ausgabe
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Hilfsfunktion: Gruppieren, Summieren und Sortieren der Bestellungen
    const groupAndSummarize = (data) => {
        const grouped = data.reduce((acc, order) => {
            if (!acc[order.menu_item_name]) {
                acc[order.menu_item_name] = {
                    name: order.menu_item_name,
                    sales: 0,
                    totalRevenue: 0,
                };
            }
            acc[order.menu_item_name].sales += 1; // Jede Bestellung zählt als 1 Verkauf
            acc[order.menu_item_name].totalRevenue += order.menu_item_price_in_cents / 100; // Preis in Euro umrechnen
            return acc;
        }, {});
        // Sortiere die gruppierten Daten nach Verkäufen (absteigend)
        return Object.values(grouped).sort((a, b) => b.sales - a.sales);
    };

    // Datenaufbereitung: Gruppieren und Sortieren
    const groupedOrders = groupAndSummarize(orders);

    // Unterteilung in "Speisen" und "Getränke" basierend auf Namen
    const speisen = groupedOrders.filter(item =>
        ["Sandwich", "Crepe", "Onigiri", "Pizza", "Salad"].some(keyword =>
            item.name.includes(keyword)
        )
    );
    const getraenke = groupedOrders.filter(item =>
        ["Cola", "Kakao", "Kaffee", "Tea", "Juice"].some(keyword =>
            item.name.includes(keyword)
        )
    );

    // Gesamtsummen für Speisen und Getränke berechnen
    const totalSpeisen = speisen.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalGetraenke = getraenke.reduce((sum, item) => sum + item.totalRevenue, 0);

    const maxSalesSpeisen = Math.max(...speisen.map(item => item.sales));
    const maxSalesGetraenke = Math.max(...getraenke.map(item => item.sales));

    const renderCategory = (data, maxSales, title, total) => (
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
                <span className={styles.totalAmount}>{total.toFixed(2)} €</span>
            </div>
        </div>
    );

    return (
        <div className={styles.salesDashboard}>
            {renderCategory(speisen, maxSalesSpeisen, 'Speisen', totalSpeisen)}
            {renderCategory(getraenke, maxSalesGetraenke, 'Getränke', totalGetraenke)}
        </div>
    );
};

export default Verkaufszahlen;
