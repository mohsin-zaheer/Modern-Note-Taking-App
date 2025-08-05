import React from 'react'
import '../App.css'
import styles from '../assets/stylesheets/nav.module.css'
import { Link } from 'react-router-dom'
import { Icon } from "@iconify/react";


const Footer = () => {
  return (
    <div className='footerBg'>
         <div className={styles.logo}>
          <Link to='/dashboard' className={styles.logo}>
            Keep Notes
          </Link>
        </div>
        <div className="copyright">
            CopyRight &copy; 2025 | All Right Reserved
        </div>
        
        <div className="socialIcons">
            <Icon icon="mingcute:instagram-line" className='socialIcon'/>
            <Icon icon="proicons:facebook" className='socialIcon'/>
            <Icon icon="si:youtube-line" className='socialIcon'/>
        </div>
       
    </div>
  )
}

export default Footer;