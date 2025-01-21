import React, { useState, useEffect, useContext } from 'react';
import { fetchUserMe, handleLogout } from '../apiService';
import { AuthContext } from "../AuthContext";
import styles from "./Profile.module.css"

const Profile = () => {

    // Zustand für den Login-Status
    const { loggedIn, setLoggedIn } = useContext(AuthContext);
    const [ user, setUser ] = useState();

    useEffect(() => {
        try {
            const loadUser = async () => { 
                const user_response = await fetchUserMe()
                setUser(user_response)
            }
            loadUser()
        } catch (error) {
            
        }
    }, [])

    function logout() {
        let successful_logout = handleLogout()
        if (successful_logout) {
            setLoggedIn(false)
        }
    }

    console.log(user)

    return (
        <div className={styles.profileContainer}>
            <p>Username: <b>{user?.username}</b></p>
            <p>Admin Status: <b>{user?.is_superuser || user?.is_staff ? 'Yes' : 'No'}</b></p>
            <p>Gruppen: <b>{user?.groups.length > 0 ? user.groups.map(group => group.name).join(', ') : 'None'}</b></p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;