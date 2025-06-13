const ToggleSwitch = ({ label, isOn, handleToggle }) => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-lg">{label}</span>
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
            isOn ? "bg-blue-500" : "bg-gray-700"
          }`}
          onClick={handleToggle}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isOn ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    );
  };
  
  export default ToggleSwitch;