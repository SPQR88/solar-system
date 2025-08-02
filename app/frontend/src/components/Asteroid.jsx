const Asteroid = ({ id, position }) => {
  const style = {
    position: 'absolute',
    width: '2px',
    height: '2px',
    backgroundColor: '#888',
    borderRadius: '50%',
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return <div id={id} className="asteroid" style={style}></div>;
};

export default Asteroid;
