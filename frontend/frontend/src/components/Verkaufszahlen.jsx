import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders, fetchProduct } from '../apiService';

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [speisen, setSpeisen] = useState([]);
    const [getraenke, setGetraenke] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalOrders, setOriginalOrders] = useState([]); // Neuer Zustand


    // Zustände für Speisen
    const [showTopProductsSpeisen, setShowTopProductsSpeisen] = useState(false);
    const [startDateSpeisen, setStartDateSpeisen] = useState('');
    const [endDateSpeisen, setEndDateSpeisen] = useState('');
    const [filteredSpeisen, setFilteredSpeisen] = useState([]);

    // Zustände für Getränke
    const [showTopProductsGetraenke, setShowTopProductsGetraenke] = useState(false);
    const [startDateGetraenke, setStartDateGetraenke] = useState('');
    const [endDateGetraenke, setEndDateGetraenke] = useState('');
    const [filteredGetraenke, setFilteredGetraenke] = useState([]);

    // Bestellungen laden
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await fetchOrders(); // API-Aufruf
                console.log('Bestellungen:', fetchedOrders);
                setOrders(fetchedOrders); // Setzt die geladenen Bestellungen
                setOriginalOrders(fetchedOrders); // Setzt die Original-Bestellungen
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
                console.log('Speisen:', foodItems);
                console.log('Getränke:', drinkItems);

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
        if (speisen.length === 0) {
            console.error('Keine Speisen-Daten verfügbar.');
            return;
        }
    
        const groupedSpeisen = groupAndSummarize(speisen).slice(0, 5);
        console.log('Top Produkte Speisen:', groupedSpeisen);
        setFilteredSpeisen(groupedSpeisen);
    };
    
    const handleTopProductsGetraenke = () => {
        if (getraenke.length === 0) {
            console.error('Keine Getränke-Daten verfügbar.');
            return;
        }
    
        const groupedGetraenke = groupAndSummarize(getraenke).slice(0, 5);
        console.log('Top Produkte Getränke:', groupedGetraenke);
        setFilteredGetraenke(groupedGetraenke);
    };
    
    

    // Gruppierungsfunktion, die auch bei der Filterung aufgerufen wird
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

    // Filtert Bestellungen nach Datum
    const filterByDateRange = (data, startDate, endDate) => {
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() : null;
    
        return data.filter(order => {
            const orderTimestamp = new Date(order.created).getTime(); // Hier Zugriff auf "created"
            if (startTimestamp && orderTimestamp < startTimestamp) return false;
            if (endTimestamp && orderTimestamp > endTimestamp) return false;
            return true;
        });
    };
    

    // Filter anwenden (bei Klicken auf den "Anwenden"-Button)
    const handleFilter = () => {
        const filteredSpeisen = filterByDateRange(speisen, startDateSpeisen, endDateSpeisen);
        const filteredGetraenke = filterByDateRange(getraenke, startDateGetraenke, endDateGetraenke);
        
        // Gruppiere die gefilterten Daten
        setFilteredSpeisen(groupAndSummarize(filteredSpeisen));
        setFilteredGetraenke(groupAndSummarize(filteredGetraenke));
    };

    const handleFilterSpeisen = () => {
        const filtered = filterByDateRange(orders, startDateSpeisen, endDateSpeisen);
        const grouped = groupAndSummarize(filtered);
        setFilteredSpeisen(grouped);
    };
    
    const handleFilterGetraenke = () => {
        const filtered = filterByDateRange(orders, startDateGetraenke, endDateGetraenke);
        const grouped = groupAndSummarize(filtered);
        setFilteredGetraenke(grouped);
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
                            setShowTopProducts(!showTopProducts);
                            if (!showTopProducts) {
                                title === 'Speisen' ? handleTopProductsSpeisen() : handleTopProductsGetraenke();
                            }
                        }}
                    >
                        Top Produkte
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
                handleFilterSpeisen 
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
                handleFilterGetraenke
            )}
        </div>
    );
};

export default Verkaufszahlen;
