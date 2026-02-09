import { useRef, useEffect } from 'react';

const AutoTextarea = ({ 
  className, 
  value, 
  onChange, 
  name, 
  placeholder, 
  rows = 1, 
  forwardedRef 
}) => {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      const newHeight = ref.current.scrollHeight + 5;
      ref.current.style.height = `${newHeight}px`;
    }
  }, [value, ref]);

  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden block w-full leading-relaxed outline-none bg-transparent appearance-none`}
    />
  );
};

export default AutoTextarea;
