import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders } from '../apiService';

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filterByDateRange = (data, startDate, endDate) => {
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() : null;

        console.log("Startdatum:", startDate, "Enddatum:", endDate);

        return data.filter(order => {
            const orderTimestamp = new Date(order.created).getTime();
            console.log("Order:", order.menu_item_name, "Datum:", order.created, "Timestamp:", orderTimestamp);

            if (startTimestamp && orderTimestamp < startTimestamp) {
                console.log("Filtered out (before start):", order.menu_item_name);
                return false;
            }
            if (endTimestamp && orderTimestamp > endTimestamp) {
                console.log("Filtered out (after end):", order.menu_item_name);
                return false;
            }
            return true;
        });
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

    const handleFilterSpeisen = () => {
        const speisen = orders.filter(order =>
            ["Sandwich", "Crepe", "Mochi", "Burger", "Pizza Slice", "Taco", "Sushi Roll", "Pasta Bowl", "Salad", "Cupcake"].some(keyword =>
                order.menu_item_name.includes(keyword)
            )
        );
        const filtered = filterByDateRange(speisen, startDateSpeisen, endDateSpeisen);
        setFilteredSpeisen(groupAndSummarize(filtered));
    };

    const handleFilterGetraenke = () => {
        const getraenke = orders.filter(order =>
            ["Cola", "Kakao", "Kaffee", "Tea", "Juice"].some(keyword =>
                order.menu_item_name.includes(keyword)
            )
        );
        const filtered = filterByDateRange(getraenke, startDateGetraenke, endDateGetraenke);
        setFilteredGetraenke(groupAndSummarize(filtered));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const renderCategory = (data, maxSales, title, total, showTopProducts, setShowTopProducts, startDate, setStartDate, endDate, setEndDate, handleFilter) => {
        const displayedData = showTopProducts ? data.slice(0, 5) : data;

        return (
            <div className={styles.salesCard}>
                <div className={styles.salesHeader}>
                    <h3>{title}</h3>
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterButton} ${showTopProducts ? styles.active : ''}`}
                            onClick={() => setShowTopProducts(!showTopProducts)}
                        >
                            Top Produkte
                        </button>
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
                            <button onClick={handleFilter} className={styles.confirmButton}>
                                Anwenden
                            </button>
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
