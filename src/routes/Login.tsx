import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './styles/login.css'

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(
        'http://localhost:8081/auth/login',
        { username, password },
        { withCredentials: true }
      );

      const response = await axios.get('http://localhost:8081/auth/verify-token', {withCredentials: true});

      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate('/lista_de_desejos');
      }
    } catch (err) {
      setError('Login falhou. Verifique suas credenciais.');
    }
  };

  return (
    <div className='login-container'>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;