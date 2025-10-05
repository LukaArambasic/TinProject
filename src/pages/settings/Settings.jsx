import React, { useState } from 'react';
import './Settings.css';
import '../../App.css';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [message, setMessage] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profil uspješno ažuriran' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Lozinka uspješno promijenjena' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = () => {
    setMessage({ type: 'success', text: 'Podaci uspješno izvezeni' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Da li ste sigurni da želite obrisati nalog? Ova akcija je nepovratna.')) {
      setMessage({ type: 'error', text: 'Nalog bi bio obrisan' });
    }
  };

  return (
    <div className='App FlexRow'>
      <Navbar />
      <div className="main-content">
        <Header pageName="Podešavanja" />
        <div className='RestOfScreen'>
          <div className="settings-container">
            {message && (
              <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                {message.text}
              </div>
            )}

            <div className="settings-section">
              <h2>Profil</h2>
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label>Ime i prezime</label>
                  <input type="text" defaultValue="Admin Korisnik" />
                </div>
                <div className="form-group">
                  <label>Email adresa</label>
                  <input type="email" defaultValue="admin@example.com" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Sačuvaj izmjene</button>
                </div>
              </form>
            </div>

            <div className="settings-section">
              <h2>Sigurnost</h2>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Trenutna lozinka</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Nova lozinka</label>
                  <input type="password" />
                </div>
                <div className="form-group">
                  <label>Potvrdi novu lozinku</label>
                  <input type="password" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Promijeni lozinku</button>
                </div>
              </form>
            </div>

            <div className="settings-section">
              <h2>Notifikacije</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Email notifikacije</h3>
                  <p>Primaj obavještenja o važnim događajima</p>
                </div>
                <div className="settings-item-control">
                  <div
                    className={`toggle-switch ${notifications ? 'active' : ''}`}
                    onClick={() => setNotifications(!notifications)}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Automatsko čuvanje</h3>
                  <p>Automatski sačuvaj promjene</p>
                </div>
                <div className="settings-item-control">
                  <div
                    className={`toggle-switch ${autoSave ? 'active' : ''}`}
                    onClick={() => setAutoSave(!autoSave)}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Izgled</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Tamna tema</h3>
                  <p>Koristi tamnu temu za aplikaciju</p>
                </div>
                <div className="settings-item-control">
                  <div
                    className={`toggle-switch ${darkMode ? 'active' : ''}`}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Podaci</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Izvoz podataka</h3>
                  <p>Preuzmite sve svoje podatke</p>
                </div>
                <div className="settings-item-control">
                  <button className="btn-secondary" onClick={handleExportData}>Izvezi podatke</button>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Zona opasnosti</h2>
              <div className="settings-item">
                <div className="settings-item-info">
                  <h3>Obriši nalog</h3>
                  <p>Trajno obriši nalog i sve podatke</p>
                </div>
                <div className="settings-item-control">
                  <button className="btn-danger" onClick={handleDeleteAccount}>Obriši nalog</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
