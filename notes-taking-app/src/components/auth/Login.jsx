import React, { useState } from 'react';
import styles from '../../assets/stylesheets/auth.module.css';
import { Link , useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate  = useNavigate();

  const handleOnChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    await login(email, password);

     if (!error) {
      navigate('/dashboard');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className={styles.signupBg}>
      <div className={styles.signupModal}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            id="email"
            className={styles.inp}
            value={email}
            onChange={handleOnChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            className={styles.inp}
            value={password}
            onChange={handleOnChange}
            placeholder="Password"
            required
          />
        
          <button type="submit" className={styles.confirmBtn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
     

          {error && <p>{error}</p>}
          
        </form>
        <div className={styles.bottom}>
          Don't Have An Account? <Link to="/register">Signup</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
