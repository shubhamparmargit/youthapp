import React, { useEffect, useState } from 'react';

const NetworkStatus = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
        <div style={styles.container}>
        <p style={styles.message}>
          You are currently offline. Please check your internet connection.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    padding: '20px',
  },
  message: {
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default NetworkStatus;
