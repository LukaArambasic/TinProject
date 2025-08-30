import React, { useState } from 'react';
import "./Login.css"
import Header from '../../components/header/Header';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('tin');
    const [password, setPassword] = useState('pederčina');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const lowercaseUsername = username.toLowerCase();
        
        if (lowercaseUsername === 'tin' && password === 'pederčina') {
            navigate("/home");
        } else {
            alert("Neispravno korisničko ime ili lozinka");
        }
        
        setIsLoading(false);
    };

    return (
        <div className='App min-h-screen'>
            <Header pageName="Prijava" />
            <div className='flex items-center justify-center min-h-screen' style={{ paddingTop: "72px" }}>
                <div className="card" style={{ width: "400px", maxWidth: "90vw" }}>
                    <div className="text-center mb-6">
                        <h1 className="headline-1">Dobrodošli</h1>
                        <p className="text-muted">Prijavite se u svoj račun</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Korisničko ime</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                placeholder="Unesite korisničko ime"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Lozinka</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Unesite lozinku"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Prijavljivanje...' : 'Prijavite se'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;