import React, { useState } from 'react';
import "./Login.css"
import Header from '../../components/header/Header';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('tin');
    const [password, setPassword] = useState('pederčina');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Convert the username to lowercase for case-insensitive comparison
        const lowercaseUsername = username.toLowerCase();
        
        // Check if the username is "Tin" and the password is "gay"
        if (lowercaseUsername === 'tin' && password === 'pederčina') {
            console.log("Login successful!");
            // Redirect the user or perform any other actions for successful login
            navigate("/home")
        } else {
            console.log("Invalid username or password");
            // Display an error message to the user or perform any other actions for failed login
        }


    };

    return (
        <div className='App FlexRow' style={{ width: "100%" }}>
            <div style={{ position: "fixed", width: "100%" }}>
                <Header pageName="Login" />
            </div>
            <div className='RestOfScreen' style={{ paddingTop: "72px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form onSubmit={handleSubmit} style={{ width: "300px" }}>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
