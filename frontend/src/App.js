import React, { useEffect, useState, useRef } from 'react';
// import './App.css';
// import './css/style.css';
import Planet from './components/Planet';
import Orbit from './components/Orbit';
import Asteroid from './components/Asteroid';

function App() {
  const defaultScale = 30;
  const minScale = 1;
  const maxScale = 50;

  const [scale, setScale] = useState(defaultScale);
  const [planets, setPlanets] = useState([]);
  const [sun, setSun] = useState({ x: 0, y: 0, radius: 10 });
  const [asteroids, setAsteroids] = useState([]);

  const containerRef = useRef(null);

  // sun
  useEffect(() => {
    const container = containerRef.current;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    setSun(prev => ({ ...prev, x: centerX, y: centerY }));
  }, []);

  // init request
  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/planets`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const initialized = data.map(planet => ({
          ...planet,
          degree: planet.degree ?? 0,
          radian: 0,
          x: 0,
          y: 0,
        }));

        setPlanets(initialized);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };

    fetchPlanets();
  }, []);

  // planets
  useEffect(() => {
    console.log(`scale ${scale}`);
    let frameId;

    const animate = () => {
      setPlanets(prevPlanets =>
        prevPlanets.map(planet => {
          const degree = planet.degree + planet.speed;
          const radian = degree * Math.PI / 180;

          const x = sun.x + (planet.a ?? planet.orbit) * Math.cos(radian) * scale / defaultScale
            + (planet.c ? planet.c * scale / defaultScale : 0);
          const y = sun.y - (planet.b ?? planet.orbit) * Math.sin(radian) * scale / defaultScale;

          // обновляем луны
          const moons = planet.moons?.map(moon => {
            const moonDegree = moon.degree + moon.speed;
            const moonRadian = moonDegree * Math.PI / 180;

            const moonX = x + moon.orbit * Math.cos(moonRadian) * scale / defaultScale;
            const moonY = y - moon.orbit * Math.sin(moonRadian) * scale / defaultScale;

            return { ...moon, degree: moonDegree, radian: moonRadian, x: moonX, y: moonY };
          });

          return { ...planet, degree, radian, x, y, moons };
        })
      );

      frameId = requestAnimationFrame(animate);
    };

    if (planets.length) frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [planets.length, scale, sun]);

  // scale
  useEffect(() => {
    const handleScroll = event => {
      let newScale = scale;
      const delta = event.deltaY;

      newScale = delta > 0 ? newScale - 1 : newScale + 1;
      newScale = Math.min(Math.max(minScale, newScale), maxScale);

      setScale(newScale);
    };

    window.addEventListener('wheel', handleScroll);

    return () => window.removeEventListener('wheel', handleScroll);
  }, [scale]);

  // asteroids
  useEffect(() => {
    if (!sun.x || !sun.y) return;

    const newAsteroids = [];

    for (let i = 0; i < 360; i++) {
      const angle = Math.PI * i / 180;
      const distance = Math.random() * (330 - 210) + 210;

      const x = sun.x + distance * Math.cos(angle) * scale / defaultScale;
      const y = sun.y - distance * Math.sin(angle) * scale / defaultScale;

      newAsteroids.push({
        id: `asteroid-${i}`,
        angle,
        distance,
        x,
        y,
      });
    }

    setAsteroids(newAsteroids);
  }, [sun, scale]);

  return (
    <div id="container" ref={containerRef}>
      {asteroids.map(a => (
        <Asteroid key={a.id} id={a.id} position={{ x: a.x, y: a.y }} />
      ))}

      <div
        id="sun"
        style={{
          position: 'absolute',
          width: sun.radius * 2 + 1,
          height: sun.radius * 2 + 1,
          left: sun.x - sun.radius,
          top: sun.y - sun.radius,
        }}
      />

      {planets.map(planet => (
        <React.Fragment key={planet.selector}>
          <Orbit
            id={`${planet.selector}-orbit`}
            center={{ x: sun.x, y: sun.y }}
            radius={planet.orbit * scale / defaultScale}
          />
          <Planet
            id={planet.selector}
            radius={planet.radius}
            position={{ x: planet.x ?? 0, y: planet.y ?? 0 }}
          />
          {planet.moons?.map(moon => (
            <Planet
              id={moon.selector}
              radius={moon.radius}
              position={{ x: moon.x ?? 0, y: moon.y ?? 0 }}
            />
        ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
