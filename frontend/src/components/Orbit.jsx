const Orbit = ({ id, center, radius }) => {
  const style = {
    position: 'absolute',
    left: `${center.x - radius}px`,
    top: `${center.y - radius}px`,
    width: `${radius * 2 + 1}px`,
    height: `${radius * 2 + 1}px`,
  };

  return <div id={id} className="orbit" style={style}></div>;
};

export default Orbit;
