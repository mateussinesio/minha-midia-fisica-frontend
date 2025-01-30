import './App.css';
import logo from './assets/logo.png';
import { Route, Routes, Link, useNavigate } from 'react-router';
import Home from './routes/Home';
import Wishlist from './routes/WishList';
import Login from './routes/Login';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get('http://localhost:8081/auth/verify-token', {withCredentials: true});
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    verifyToken();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8081/auth/logout',
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="title-and-description">
        <h1>Minha Mídia Física</h1>
        <p>Gerenciamento de compras de mídias físicas</p>
      </div>
      <div className="header">
        <nav>
          <Link to="/">Início</Link>
          {isLoggedIn ? (
            <>
              <Link to="/lista_de_desejos">Lista de desejos</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/lista_de_desejos"
          element={
            isLoggedIn ? (
              <Wishlist />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;