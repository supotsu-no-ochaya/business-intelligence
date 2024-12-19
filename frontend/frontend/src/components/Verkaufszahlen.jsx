import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders, fetchSpeisen } from '../apiService'; // Importiere die API-Funktionen

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [speisen, setSpeisen] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bestellungen laden
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
                console.log('Orders:', fetchedOrders);
            } catch (error) {
                console.error('Fehler beim Laden der Bestellungen:', error);
            }
        };

        loadOrders();
    }, []);

    // Speisen aus der API laden und filtern
    useEffect(() => {
        const loadSpeisen = async () => {
            try {
                const fetchedSpeisen = await fetchSpeisen();
                console.log('Speisen:', fetchedSpeisen);

                // Filtere Bestellungen basierend auf Speisen-Daten
                const filteredSpeisen = orders.filter(order =>
                    fetchedSpeisen.some(speise => order.menu_item_name.includes(speise.name))
                );
                console.log('speisen:', filteredSpeisen);
                setSpeisen(filteredSpeisen);
            } catch (error) {
                console.error('Fehler beim Laden der Speisen:', error);
            } finally {
                setLoading(false);
                
            }
        };

        // Nur laden, wenn Bestellungen vorhanden sind
        if (orders.length > 0) {
            loadSpeisen();
        }
    }, [orders]);

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

    // Gruppierte Daten
    const groupedSpeisen = groupAndSummarize(speisen);
    const getraenke = groupAndSummarize(
        orders.filter(order =>
            ["Cola", "Kakao", "Kaffee", "Tea", "Juice"].some(keyword =>
                order.menu_item_name.includes(keyword)
            )
        )
    );
    

    // Gesamtsummen berechnen
    const totalSpeisen = groupedSpeisen.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalGetraenke = getraenke.reduce((sum, item) => sum + item.totalRevenue, 0);

    const maxSalesSpeisen = Math.max(...groupedSpeisen.map(item => item.sales), 0);
    const maxSalesGetraenke = Math.max(...getraenke.map(item => item.sales), 0);

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
            {renderCategory(groupedSpeisen, maxSalesSpeisen, 'Speisen', totalSpeisen)}
            {renderCategory(getraenke, maxSalesGetraenke, 'Getränke', totalGetraenke)}
        </div>
    );
};

export default Verkaufszahlen;
