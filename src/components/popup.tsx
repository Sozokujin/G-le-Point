import React, { useState, useEffect } from 'react';

const Popup = ({ message, duration }: { message: string, duration: number }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
  
      return () => clearTimeout(timer);
    }, [duration]);
  
    if (!visible) return null;
  return (
    <div className='fixed top-4 right-4 max-w-96 h-auto flex items-center justify-center rounded-sm bg-glp-green text-white p-4'>
      <p>{message}</p>
    </div>
  );
};

export default Popup;
