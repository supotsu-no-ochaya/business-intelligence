import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders, fetchProduct } from '../apiService';

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [speisen, setSpeisen] = useState([]);
    const [getraenke, setGetraenke] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalOrders, setOriginalOrders] = useState([]); // Original-Bestellungen

    // Zustände für Speisen
    const [showTopProductsSpeisen, setShowTopProductsSpeisen] = useState(false);
    const [startDateSpeisen, setStartDateSpeisen] = useState(getDefaultStartDate());
    const [endDateSpeisen, setEndDateSpeisen] = useState(getDefaultEndDate());
    const [filteredSpeisen, setFilteredSpeisen] = useState([]);

    // Zustände für Getränke
    const [showTopProductsGetraenke, setShowTopProductsGetraenke] = useState(false);
    const [startDateGetraenke, setStartDateGetraenke] = useState(getDefaultStartDate());
    const [endDateGetraenke, setEndDateGetraenke] = useState(getDefaultEndDate());
    const [filteredGetraenke, setFilteredGetraenke] = useState([]);

    // Standard-Daten für Datepicker (z. B. letzte 7 Tage)
    function getDefaultStartDate() {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return sevenDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function getDefaultEndDate() {
        return new Date().toISOString().split('T')[0]; // Heute
    }

    // Bestellungen laden
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
                setOriginalOrders(fetchedOrders); // Originale Bestellungen speichern
            } catch (error) {
                console.error('Fehler beim Laden der Bestellungen:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Produkte aus der API laden und filtern
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { foodItems, drinkItems } = await fetchProduct();

                const filteredSpeisen = orders.filter(order =>
                    foodItems.some(speise => order.menu_item_name.includes(speise.name))
                );
                const filteredGetraenke = orders.filter(order =>
                    drinkItems.some(getraenk => order.menu_item_name.includes(getraenk.name))
                );

                setSpeisen(filteredSpeisen);
                setGetraenke(filteredGetraenke);

                // Initiale Gruppierung ohne Filter
                setFilteredSpeisen(groupAndSummarize(filteredSpeisen));
                setFilteredGetraenke(groupAndSummarize(filteredGetraenke));
            } catch (error) {
                console.error('Fehler beim Laden der Produkte:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orders.length > 0) {
            loadProducts();
        }
    }, [orders]);

    const handleTopProductsSpeisen = () => {
        if (showTopProductsSpeisen) {
            // Top-Produkte deaktivieren: Originalansicht wiederherstellen
            setFilteredSpeisen(groupAndSummarize(speisen));
        } else {
            // Top-Produkte aktivieren
            const groupedSpeisen = groupAndSummarize(speisen).slice(0, 5);
            setFilteredSpeisen(groupedSpeisen);
        }
        setShowTopProductsSpeisen(!showTopProductsSpeisen);
    };

    const handleTopProductsGetraenke = () => {
        if (showTopProductsGetraenke) {
            // Top-Produkte deaktivieren: Originalansicht wiederherstellen
            setFilteredGetraenke(groupAndSummarize(getraenke));
        } else {
            // Top-Produkte aktivieren
            const groupedGetraenke = groupAndSummarize(getraenke).slice(0, 5);
            setFilteredGetraenke(groupedGetraenke);
        }
        setShowTopProductsGetraenke(!showTopProductsGetraenke);
    };

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

    const renderCategory = (data, maxSales, title, total, showTopProducts, setShowTopProducts, startDate, setStartDate, endDate, setEndDate, handleFilter) => {
        return (
            <div className={styles.salesCard}>
                <div className={styles.salesHeader}>
                    <h3>{title}</h3>
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterButton} ${showTopProducts ? styles.active : ''}`}
                            onClick={() => {
                                title === 'Speisen' ? handleTopProductsSpeisen() : handleTopProductsGetraenke();
                            }}
                        >
                            {showTopProducts ? 'Alle Produkte' : 'Top Produkte'}
                        </button>

                        <div className={styles.dateFilters}>
                            <div className={styles.dateFilterRow}>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={styles.datePicker}
                                    placeholder="Startdatum"
                                />
                            </div>
                            <div className={styles.dateFilterRow}>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={styles.datePicker}
                                    placeholder="Enddatum"
                                />
                            </div>
                            <button onClick={handleFilter} className={styles.confirmButton}>
                                Anwenden
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.salesCategory}>
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
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const totalSpeisen = filteredSpeisen.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalGetraenke = filteredGetraenke.reduce((sum, item) => sum + item.totalRevenue, 0);

    const maxSalesSpeisen = Math.max(...filteredSpeisen.map(item => item.sales), 0);
    const maxSalesGetraenke = Math.max(...filteredGetraenke.map(item => item.sales), 0);

    return (
        <div className={styles.salesDashboard}>
            {renderCategory(
                filteredSpeisen,
                maxSalesSpeisen,
                'Speisen',
                totalSpeisen,
                showTopProductsSpeisen,
                setShowTopProductsSpeisen,
                startDateSpeisen,
                setStartDateSpeisen,
                endDateSpeisen,
                setEndDateSpeisen,
            )}
            {renderCategory(
                filteredGetraenke,
                maxSalesGetraenke,
                'Getränke',
                totalGetraenke,
                showTopProductsGetraenke,
                setShowTopProductsGetraenke,
                startDateGetraenke,
                setStartDateGetraenke,
                endDateGetraenke,
                setEndDateGetraenke,
            )}
        </div>
    );
};

export default Verkaufszahlen;
