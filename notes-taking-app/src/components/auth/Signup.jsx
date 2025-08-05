import React, { useState, useEffect } from 'react';
import styles from '../../assets/stylesheets/auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import userPlaceholder from '../../assets/addProfile.png';

const Signup = () => {
  const { register, loading, error, user } = useAuthStore();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  if (!imageFile) {
    setPreview(null);
    return;
  }
  const objectUrl = URL.createObjectURL(imageFile);
  
  setPreview(objectUrl);

  return () => URL.revokeObjectURL(objectUrl);
}, [imageFile]);


  const handleOnChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'email') setEmail(value);
    else if (id === 'password') setPassword(value);
    else if (id === 'name') setName(value);
    else if (id === 'confirmPassword') setConfirmPassword(value);
    else if (id === 'username') setUsername(value);
    else if (id === 'imageUpload') {
      if (files && files[0]) setImageFile(files[0]);
    }
  

  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await axios.post('/api/upload/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImageUploading(false);
      return res.data.imageUrl;
    } catch (err) {
      setImageUploading(false);
      toast.error('Image upload failed');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    console.log('Image:' , imageUrl);
    

    await register(name, username, email, password, imageUrl);

    if (!error) {
      setUsername('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setImageFile(null);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className={styles.signupBg}>
      <div className={styles.signupModal}>
        <h2 className={styles.title}>Sign up</h2>

        {/* Image Upload with preview */}
        <label htmlFor="imageUpload" className={styles.imageLabel}>
          <div
              className={styles.imagePreview}
                  style={{
                    backgroundImage: `url(${preview || userPlaceholder})`
                  }}
          >
          </div>
            {!preview && <span className={styles.uploadText}>Add Profile Pic</span>}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleOnChange}
          style={{ display: 'none' }}
          name="image"
        />
        {imageUploading && <div>Uploading Image...</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            id="username"
            className={styles.inp}
            value={username}
            onChange={handleOnChange}
            placeholder="Username"
            required
          />
          <input
            type="text"
            id="name"
            className={styles.inp}
            value={name}
            onChange={handleOnChange}
            placeholder="Name"
            required
          />
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
          <input
            type="password"
            id="confirmPassword"
            className={styles.inp}
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            required
          />
          <button
            className={styles.confirmBtn}
            disabled={loading || imageUploading}
            type="submit"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className={styles.bottom}>
          Already Have An Account <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};


export default Signup;
