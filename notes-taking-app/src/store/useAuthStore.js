import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';


// Optionally: Set base URL from env file
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post('/api/users/login', { email, password });

      localStorage.setItem('user', JSON.stringify(data));
      console.log(data);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      set({ user: data, loading: false, error: null });
      toast.success('Login successful!');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  register: async (name , username, email, password, imageUrl) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post('/api/users/register', { name, username, email, password, imageUrl});

      localStorage.setItem('user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      set({ user: data, loading: false, error: null });
      toast.success('Registration successful!');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, error: null });
    toast.info('Logged out.');
  },
  updateProfilePic: async (imageUrl) => {
  
  set({ loading: true, error: null });

  try {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    const { data } = await axios.put('/api/users/profile-pic', { imageUrl },   {
    headers: {
      Authorization: `Bearer ${savedUser.token}`,
    },
  });
    if (savedUser?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedUser.token}`;
    }
    localStorage.setItem('user', JSON.stringify(data));

    set({ user: data , loading: false });
    toast.success('Profile picture updated!');
  } catch (err) {
    const message = err.response?.data?.message || 'Update failed';
    set({ error: message, loading: false });

    toast.error(message);
  }
}

}));

export default useAuthStore;
