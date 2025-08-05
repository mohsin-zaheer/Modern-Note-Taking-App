import React, { useEffect, useState } from 'react'
import styles from '../assets/stylesheets/nav.module.css'
import { Link } from 'react-router-dom'
import userImg from '../assets/user.png'
import useModalStore from '../store/modalStore';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {

  const { openAddModal } = useModalStore();
  const {user} = useAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`${styles.navbar}`}>
        <div className={styles.logo}>
          <Link to='/dashboard' className={styles.logo}>
            Keep Notes
          </Link>
        </div>
        <div className={styles.nav_right}>
           <button className={styles.btn} onClick={openAddModal}>{isMobile ? '+' : '+ Add Note'}</button>
            <Link to='/profile'>
              <img src={!user?.image ? userImg : user?.image} alt="user" className={styles.user} />
            </Link>
        </div>
    </div>
  )
}

export default Navbar;