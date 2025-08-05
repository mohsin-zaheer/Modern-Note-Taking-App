import React from 'react';
import styles from '../assets/stylesheets/loading.module.css'; // or use Tailwind classes

const LoadingSpinner = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
