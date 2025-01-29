import React, { useState, useEffect } from 'react';
import styles from './Verkaufszahlen.module.css';
import { fetchOrders, fetchProduct, fetchEvents } from '../apiService';

const Verkaufszahlen = () => {
    const [orders, setOrders] = useState([]);
    const [speisen, setSpeisen] = useState([]);
    const [getraenke, setGetraenke] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredSpeisen, setFilteredSpeisen] = useState([]);
    const [filteredGetraenke, setFilteredGetraenke] = useState([]);
    const [showTopProductsSpeisen, setShowTopProductsSpeisen] = useState(false);
    const [showTopProductsGetraenke, setShowTopProductsGetraenke] = useState(false);
    const [startDateSpeisen, setStartDateSpeisen] = useState(getDefaultStartDate());
    const [endDateSpeisen, setEndDateSpeisen] = useState(getDefaultEndDate());
    const [startDateGetraenke, setStartDateGetraenke] = useState(getDefaultStartDate());
    const [endDateGetraenke, setEndDateGetraenke] = useState(getDefaultEndDate());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [dateError, setDateError] = useState('');

    function getDefaultStartDate() {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return sevenDaysAgo.toISOString().split('T')[0];
    }

    function getDefaultEndDate() {
        return new Date().toISOString().split('T')[0];
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const { foodItems, drinkItems } = await fetchProduct();
    
                // Filtere alle Bestellungen für Speisen & Getränke (ohne Zeitfilter)
                const speisenOrders = orders.filter(order =>
                    foodItems.some(speise => order.menu_item_name.includes(speise.name))
                );
                const getraenkeOrders = orders.filter(order =>
                    drinkItems.some(getraenk => order.menu_item_name.includes(getraenk.name))
                );
    
                setSpeisen(speisenOrders);
                setGetraenke(getraenkeOrders);
    
                // **Zeige beim ersten Laden ALLE Produkte ohne Zeitfilter**
                setFilteredSpeisen(groupAndSummarize(speisenOrders));
                setFilteredGetraenke(groupAndSummarize(getraenkeOrders));
            } catch (error) {
                console.error('Fehler beim Laden der Produkte:', error);
            }
        };
    
        if (orders.length > 0) {
            loadProducts();
        }
    }, [orders]);

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

    const filterByDateRange = (data, startDate, endDate) => {
        const startTimestamp = startDate ? new Date(startDate).getTime() : null;
        const endTimestamp = endDate ? new Date(endDate).getTime() : null;

        return data.filter(order => {
            const orderTimestamp = new Date(order.created).getTime();
            if (startTimestamp && orderTimestamp < startTimestamp) return false;
            if (endTimestamp && orderTimestamp > endTimestamp) return false;
            return true;
        });
    };

    const handleEventChange = (eventId) => {
        setSelectedEvent(eventId);
    
        if (eventId === 'all') {
            // Falls "Alle Events" gewählt wurde, Standardwerte setzen
            setStartDateSpeisen(getDefaultStartDate());
            setEndDateSpeisen(getDefaultEndDate());
            setStartDateGetraenke(getDefaultStartDate());
            setEndDateGetraenke(getDefaultEndDate());
        } else {
            // Passendes Event suchen
            const event = events.find(e => e.id === parseInt(eventId));
            if (event) {
                setStartDateSpeisen(event.start_date);
                setEndDateSpeisen(event.end_date);
                setStartDateGetraenke(event.start_date);
                setEndDateGetraenke(event.end_date);
            }
        }
    };

    const validateDates = (startDate, endDate, setError) => {
        if (new Date(startDate) > new Date(endDate)) {
            setError('⚠️ Das Startdatum darf nicht nach dem Enddatum liegen.');
            return false;
        }
        setError('');
        return true;
    };
    
    const handleStartDateChange = (e, setStartDate, endDate, setError) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        validateDates(newStartDate, endDate, setError);
    };
    
    const handleEndDateChange = (e, setEndDate, startDate, setError) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        validateDates(startDate, newEndDate, setError);
    };    
    
    const filterByEvent = (data, selectedEventId) => {
        if (selectedEventId === 'all') return data; // Kein Event-Filter
    
        const event = events.find(e => e.id === parseInt(selectedEventId));
        if (!event) return data; // Falls Event nicht gefunden wird
    
        const startTimestamp = new Date(event.start_date).getTime();
        const endTimestamp = new Date(event.end_date).getTime();
    
        return data.filter(order => {
            const orderTimestamp = new Date(order.created).getTime();
            return orderTimestamp >= startTimestamp && orderTimestamp <= endTimestamp;
        });
    };        

    const handleFilter = () => {
        let filteredSpeisen = filterByDateRange(speisen, startDateSpeisen, endDateSpeisen);
        let filteredGetraenke = filterByDateRange(getraenke, startDateGetraenke, endDateGetraenke);
    
        filteredSpeisen = filterByEvent(filteredSpeisen, selectedEvent);
        filteredGetraenke = filterByEvent(filteredGetraenke, selectedEvent);
    
        setFilteredSpeisen(groupAndSummarize(filteredSpeisen));
        setFilteredGetraenke(groupAndSummarize(filteredGetraenke));
    };  

    const handleTopProductsSpeisen = () => {
        setShowTopProductsSpeisen(!showTopProductsSpeisen);
    
        if (!showTopProductsSpeisen) {
            // Zeige die Top 5 Produkte aus allen Bestellungen (unabhängig vom Zeitraum)
            const topSpeisen = groupAndSummarize(speisen).slice(0, 5);
            setFilteredSpeisen(topSpeisen);
        } else {
            // Zeige ALLE Speisen (unabhängig von der Zeitfilterung)
            setFilteredSpeisen(groupAndSummarize(speisen));
        }
    };
    
    const handleTopProductsGetraenke = () => {
        setShowTopProductsGetraenke(!showTopProductsGetraenke);
    
        if (!showTopProductsGetraenke) {
            // Zeige die Top 5 Produkte aus allen Getränken (unabhängig vom Zeitraum)
            const topGetraenke = groupAndSummarize(getraenke).slice(0, 5);
            setFilteredGetraenke(topGetraenke);
        } else {
            // Zeige ALLE Getränke (unabhängig von der Zeitfilterung)
            setFilteredGetraenke(groupAndSummarize(getraenke));
        }
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

    const renderCategory = (data, maxSales, title, total, showTopProducts, startDate, endDate, setStartDate, setEndDate, handleTopProducts) => (
        <div className={styles.salesCard}>
            <div className={styles.salesHeader}>
                <h3>{title}</h3>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterButton} ${showTopProducts ? styles.active : ''}`}
                        onClick={handleTopProducts}
                    >
                        {showTopProducts ? 'Alle Produkte' : 'Top Produkte'}
                    </button>

                    <div className={styles.dateFilters}>
                    <input
                        type="date"
                        value={startDateSpeisen}
                        onChange={(e) => handleStartDateChange(e, setStartDateSpeisen, endDateSpeisen, setDateError)}
                        className={styles.datePicker}
                    />
                    <input
                        type="date"
                        value={endDateSpeisen}
                        onChange={(e) => handleEndDateChange(e, setEndDateSpeisen, startDateSpeisen, setDateError)}
                        className={styles.datePicker}
                    />
                    {dateError && <p className={styles.errorMessage}>{dateError}</p>}                    

                        <button onClick={handleFilter} className={styles.confirmButton}>
                            Anwenden
                        </button>
                        <select 
                            value={selectedEvent} 
                            onChange={(e) => handleEventChange(e.target.value)}
                            className={styles.dropdown}
                        >
                            <option value="all">Alle Events</option>
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.name} ({event.start_date} - {event.end_date})
                                </option>
                            ))}
                        </select>

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
                                style={{ width: `${(item.sales / maxSales) * 100}%` }}
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
            {renderCategory(filteredSpeisen, Math.max(...filteredSpeisen.map(item => item.sales), 0), 'Speisen', filteredSpeisen.reduce((sum, item) => sum + item.totalRevenue, 0), showTopProductsSpeisen, startDateSpeisen, endDateSpeisen, setStartDateSpeisen, setEndDateSpeisen, handleTopProductsSpeisen)}
            {renderCategory(filteredGetraenke, Math.max(...filteredGetraenke.map(item => item.sales), 0), 'Getränke', filteredGetraenke.reduce((sum, item) => sum + item.totalRevenue, 0), showTopProductsGetraenke, startDateGetraenke, endDateGetraenke, setStartDateGetraenke, setEndDateGetraenke, handleTopProductsGetraenke)}
        </div>
    );
};

export default Verkaufszahlen;
