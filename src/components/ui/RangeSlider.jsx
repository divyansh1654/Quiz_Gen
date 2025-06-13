const RangeSlider = ({ min, max, value, onChange, className }) => {
    return (
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${className}`}
      />
    );
  };
  
  export default RangeSlider;