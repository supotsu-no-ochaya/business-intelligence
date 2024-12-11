import React, { useEffect, useState } from 'react';
import { fetchTotalEarnings } from '../apiService'; // Importiere die angepasste API-Funktion

const Dashboard = () => {
    const [totalEarnings, setTotalEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const earnings = await fetchTotalEarnings(); // Hole die "total earnings" aus der API
                setTotalEarnings(earnings);
                console.log(earnings);
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

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Total Earnings</h2>
            <p>The total earnings are: <strong>${totalEarnings}</strong></p>
        </div>
    );
};

export default Dashboard;
