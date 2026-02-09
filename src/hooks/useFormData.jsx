import { useState, useEffect } from 'react';
import { DEFAULT_FRUIT_DATA } from '../constants/defaultData';

export const useFormData = () => {
  const [formData, setFormData] = useState(DEFAULT_FRUIT_DATA);

  useEffect(() => {
    const savedData = localStorage.getItem('fruitData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fruitData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return { formData, setFormData, handleInputChange };
};
