import { useState, useEffect } from 'react';

function useLocalStorage(key) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(key));
    setData(savedData);
  }, [key]);

  return data;
}

export default useLocalStorage;
