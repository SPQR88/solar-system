import React from 'react';

const Planet = ({ id, position, radius }) => {
  const style = {
    position: 'absolute',
    left: `${position.x - radius}px`,
    top: `${position.y - radius}px`,
    width: `${radius * 2 + 1}px`,
    height: `${radius * 2 + 1}px`,
  };

  return <div id={id} className="planet" style={style}></div>;
};

export default Planet;
