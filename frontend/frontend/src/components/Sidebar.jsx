import React, { useState, useEffect } from 'react';
import './Sidebar.css'; // Importiere das CSS-Stylesheet
import { fetchUserMe } from '../apiService';
import logo from '../assets/Logo.png'

const Sidebar = ({ navigate }) => {
    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await fetchUserMe();
                console.log(user)
                // Extrahiere den Gruppennamen aus der Datenstruktur
                if (user.is_superuser || user.is_staff || (user.groups && user.groups.length > 0)) {
                    let group = 'user'
                    if (user.is_superuser || user.is_staff) {
                        group = 'Admin'
                    } else if (user.groups && user.groups.length > 0) {
                        group = user.groups[0].name
                    }

                    setUserGroup(group); // Nimm den ersten Gruppennamen an
                } else {
                    console.error('Keine Gruppen gefunden für den Benutzer');
                }
            } catch (error) {
                console.error('Fehler beim Laden des Benutzers:', error);
            }
        };

        loadUser();
    }, []);

    if (!userGroup) {
        console.log("userGroup:", userGroup);
        
        return <div className="sidebar">Lade Benutzer...</div>;
    }

    // Sichtbarkeitslogik basierend auf der Benutzergruppe
    const menuItems = [
        //{ label: 'Dashboard', icon: '⌛', route: 'dashboard', groups: ['Kasse', 'Kueche', 'Admin'] },
        //{ label: 'Verbrauch', icon: '🍴', route: 'verbrauch', groups: ['Kueche', 'Admin'] },
        //{ label: 'Zutaten', icon: '📦', route: 'zutaten', groups: ['Kueche', 'Admin'] },
        { label: 'Lager', icon: '📦', route: 'lager', groups: ['Kueche', 'Admin'] },
        { label: 'Transaktionen', icon: '💳', route: 'transaktionen', groups: ['Kasse', 'Admin'] },
        //{ label: 'Einnahmen', icon: '📈', route: 'einnahmen', groups: ['Kasse', 'Admin'] },
        //{ label: 'Ausgaben', icon: '💲', route: 'ausgaben', groups: ['Kasse', 'Admin'] },
        { label: 'Verkaufszahlen', icon: '📊', route: 'verkaufszahlen', groups: ['Kasse', 'Admin'] },
    ];

    const bottomLinks = [
        { label: 'Settings', icon: '⚙️', route: 'settings', groups: ['Kasse', 'Kueche', 'Admin'] },
        { label: 'Profile / Logout', icon: '🔓', route: 'profile', groups: ['Kasse', 'Kueche', 'Admin'] },
    ];

    const renderMenuItems = (items) => {
        return items
            .filter(item => item.groups.includes(userGroup))
            .map((item, index) => (
                <li key={index} className="nav-item" onClick={() => navigate(item.route)}>
                    <i className="icon">{item.icon}</i> {item.label}
                </li>
            ));
    };

    return (
      <div className="sidebar">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <div style={{ width: '100%', border: '1px #1D1E2C solid' }}></div>
          <ul className="nav-list">
              {renderMenuItems(menuItems)}
          </ul>
          <div style={{ width: '100%', border: '1px #1D1E2C solid' }}></div>
          <div className="bottom-links">
              {renderMenuItems(bottomLinks)}
          </div>
      </div>
  );
};

export default Sidebar;