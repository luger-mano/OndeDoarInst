import React from "react";

const HeroButton = React.forwardRef(({ primary, text, icon, filter, onClick }, ref) => {
  return (
    <button
      ref={ref}
      className="Button"
      data-primary={primary}
      onClick={onClick}
    >
      {text}
      {filter && <span className="filter" style={{ fontWeight: 'bold', marginLeft: '5px' }}>{filter}</span>}
      {icon && <span className="caret" style={{ marginLeft: '8px' }}>{icon}</span>}
    </button>
  );
});

export default HeroButton;