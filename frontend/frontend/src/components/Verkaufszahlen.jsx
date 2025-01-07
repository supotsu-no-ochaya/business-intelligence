import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders, fetchSpeisen } from '../apiService'; // Importiere die API-Funktionen

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [speisen, setSpeisen] = useState([]);
    const [loading, setLoading] = useState(true);

    // Zustände für Speisen
    const [showTopProductsSpeisen, setShowTopProductsSpeisen] = useState(false);
    const [startDateSpeisen, setStartDateSpeisen] = useState('');
    const [endDateSpeisen, setEndDateSpeisen] = useState('');

    // Zustände für Getränke
    const [showTopProductsGetraenke, setShowTopProductsGetraenke] = useState(false);
    const [startDateGetraenke, setStartDateGetraenke] = useState('');
    const [endDateGetraenke, setEndDateGetraenke] = useState('');

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
            acc[order.menu_item_name].sales += 1;
            acc[order.menu_item_name].totalRevenue += order.menu_item_price_in_cents / 100;
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => b.sales - a.sales);
    };

    // Zeitraumfilter anwenden
    const filterByDateRange = (data, startDate, endDate) => {
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() : null;

        return data.filter(order => {
            const orderTimestamp = new Date(order.date).getTime();
            if (startTimestamp && orderTimestamp < startTimestamp) return false;
            if (endTimestamp && orderTimestamp > endTimestamp) return false;
            return true;
        });
    };

    // Gruppierte Daten vorbereiten
    const groupedOrders = groupAndSummarize(orders);

    const renderCategory = (data, maxSales, title, total, showTopProducts, setShowTopProducts, startDate, setStartDate, endDate, setEndDate) => {
        // Zeitraumfilter anwenden
        const filteredData = filterByDateRange(data, startDate, endDate);

        // Top 5 Produkte filtern
        const displayedData = showTopProducts ? filteredData.slice(0, 5) : filteredData;

        return (
            <div className={styles.salesCard}>
                <div className={styles.salesHeader}>
                    <h3>{title}</h3>
                    <div className={styles.filters}>
                        {/* Top-Produkte-Button */}
                        <button
                            className={`${styles.filterButton} ${showTopProducts ? styles.active : ''}`}
                            onClick={() => setShowTopProducts(!showTopProducts)}
                        >
                            Top Produkte
                        </button>
                        {/* Zeitraum-Filter */}
                        <div className={styles.dateFilters}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={styles.datePicker}
                                placeholder="Startdatum"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={styles.datePicker}
                                placeholder="Enddatum"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.salesCategory}>
                    {displayedData.map((item, index) => (
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
    };

    // Speisen und Getränke filtern
    /*const speisen = groupedOrders.filter(item =>
        ["Sandwich", "Crepe", "Mochi", "Burger", "Pizza Slice", "Taco", "Sushi Roll", "Pasta Bowl", "Salad", "Cupcake"].some(keyword =>
            item.name.includes(keyword)
        )
    );
    */
    const getraenke = groupedOrders.filter(item =>
        ["Cola", "Kakao", "Kaffee", "Tea", "Juice"].some(keyword =>
            item.name.includes(keyword)
        )
    );
    

    const totalSpeisen = speisen.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalGetraenke = getraenke.reduce((sum, item) => sum + item.totalRevenue, 0);

    const maxSalesSpeisen = Math.max(...speisen.map(item => item.sales), 0);
    const maxSalesGetraenke = Math.max(...getraenke.map(item => item.sales), 0);

    return (
        <div className={styles.salesDashboard}>
            {renderCategory(
                speisen,
                maxSalesSpeisen,
                'Speisen',
                totalSpeisen,
                showTopProductsSpeisen,
                setShowTopProductsSpeisen,
                startDateSpeisen,
                setStartDateSpeisen,
                endDateSpeisen,
                setEndDateSpeisen
            )}
            {renderCategory(
                getraenke,
                maxSalesGetraenke,
                'Getränke',
                totalGetraenke,
                showTopProductsGetraenke,
                setShowTopProductsGetraenke,
                startDateGetraenke,
                setStartDateGetraenke,
                endDateGetraenke,
                setEndDateGetraenke
            )}
        </div>
    );
};

export default Verkaufszahlen;
