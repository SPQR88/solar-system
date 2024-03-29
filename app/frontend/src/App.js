import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './css/style.css';

function App() {
  const defaultScale = 30;
  const [scale, setScale] = useState(30);
  const [asteroids, setAsteroids] = useState([]);
  const [planets, setPlanets] = useState([]);

  const scaleRef = useRef(scale);
  const asteroidsRef = useRef(asteroids);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/planets`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`get data: ${data}`);
        setPlanets(data);
      } catch (e) {
        // setError(e.message);
      }
    };

    fetchPlanets();
  }, []);

  useEffect(() => {
    scaleRef.current = scale;
    asteroidsRef.current = asteroids; 
    init();
    updateAsteroids();
  }, [scale]);

  useEffect(() => {
    console.log(`use effect for planets`, planets);
    if (planets.length) {
      init();
      createAsteroids();
      setInterval(intervalFunc, 10);
    }
  }, [planets]);

  const sun = {
    selector: 'sun',
    x: 400,
    y: 400,
    radius: 10
  }

  const setPosition = (item, x, y) => {
    document.querySelector(`#${item.selector}`).style.left = x - item.radius + 'px';
    document.querySelector(`#${item.selector}`).style.top  = y - item.radius + 'px';
  };
  const setSize = (item) => {
    document.querySelector(`#${item.selector}`).style.width = item.radius * 2 + 1 + 'px';
    document.querySelector(`#${item.selector}`).style.height = item.radius * 2 + 1 + 'px';
  };

  const init = () => {
    console.log(`init: ${planets}`);
    sun.x = parseInt(document.querySelector('#container').offsetWidth / 2);
    sun.y = parseInt(document.querySelector('#container').offsetHeight / 2);
    setSize(sun);
    setPosition(sun, sun.x, sun.y);

    planets.forEach((item, key) => {
        let planetOrbit = document.querySelector(`#${item.selector}-orbit`);

        setSize(item);
        if (item.moons) {
          item.moons.forEach((moon) => {
            setSize(moon);
          });
        }

        let orbit = Math.round(item.orbit * scale / defaultScale);
        planetOrbit.style.top = parseInt(sun.y - orbit) + 'px'
        planetOrbit.style.left = parseInt(sun.x - orbit) + 'px'
        planetOrbit.style.width = parseInt(orbit * 2 + 1) + 'px'
        planetOrbit.style.height = parseInt(orbit * 2 + 1) + 'px'
    });
  }

  const intervalFunc = function() {
    const scale = scaleRef.current;
    planets.forEach((item) => {
      let planet = document.querySelector(`#${item.selector}`);

      item.degree += item.speed;
      item.radian = item.degree * Math.PI / 180;

      if (item.a && item.b && item.c) {
        const posX = Math.round(sun.x + item.a * Math.cos(item.radian) * scale / defaultScale + item.c * scale / defaultScale);
        const posY =  Math.round(sun.y - item.b * Math.sin(item.radian) * scale / defaultScale);
        planet.style.left = posX - item.radius + 'px';
        planet.style.top  = posY - item.radius + 'px';
      } else {
        const posX = Math.round(sun.x + item.orbit * Math.cos(item.radian) * scale / defaultScale);
        const posY = Math.round(sun.y - item.orbit * Math.sin(item.radian) * scale / defaultScale);
        setPosition(item, posX, posY);

        if (item.moons) {
          item.moons.forEach((moon) => {
            moon.degree += moon.speed;
            moon.radian = moon.degree * Math.PI / 180;

            setPosition(moon,
              Math.round(posX + moon.orbit * Math.cos(moon.radian) * scale / defaultScale),
              Math.round(posY - moon.orbit * Math.sin(moon.radian) * scale / defaultScale)
            );
          });
        }
      }
    });
  };

  function createAsteroids() {
    console.log(`create asteroids`);
    const asteroids = [];
    for (let i = 0; i < 360; i++) {
        for (let j = 0; j < 1; j++) {
            const distance = Math.random() * (330 - 210) + 210;

            const x = sun.x + Math.floor(distance * Math.cos(Math.PI * i / 180) * scale / defaultScale);
            const y = sun.y - Math.floor(distance * Math.sin(Math.PI * i / 180) * scale / defaultScale);
            asteroids.push({i, j, distance});

            const asteroid = document.createElement('div');
            asteroid.id = 'asteroid-' + i + '-' + j;
            asteroid.className = 'asteroid';
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;

            document.querySelector('#container').appendChild(asteroid);
        }
    }

    setAsteroids(asteroids);
  }

  function updateAsteroids() {
    const scale = scaleRef.current;
    const asteroids = asteroidsRef.current;
    // console.log(`update asteroids: ${scale}`);
    // console.log(asteroids);
    for (const asteroid of asteroids) {
      let obj = document.querySelector(`#asteroid-${asteroid.i}-${asteroid.j}`);

      /*if (scale <= 3) {
          if (asteroid.j === 0) {
              const x = Math.floor(sun.x + asteroid.distance * Math.cos(asteroid.i * Math.PI / 180) * scale / 10);
              const y = Math.floor(sun.y - asteroid.distance * Math.sin(asteroid.i * Math.PI / 180) * scale / 10);
              obj.style.left = `${x}px`;
              obj.style.top = `${y}px`;
          } else {
              obj.style.display  = 'none';
          }
      } else {*/
          obj.style.display  = 'block';
          const x = Math.floor(sun.x + asteroid.distance * Math.cos(asteroid.i * Math.PI / 180) * scale / defaultScale);
          const y = Math.floor(sun.y - asteroid.distance * Math.sin(asteroid.i * Math.PI / 180) * scale / defaultScale);
          obj.style.left = `${x}px`;
          obj.style.top = `${y}px`;
      // }
    }
  }

  const handlePlanetClick = async (planetName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/planets/${planetName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Planet data: ${JSON.stringify(data)}`);
    } catch (e) {
      // setError(e.message);
    }
  };

  function handleScroll(event) {
    // Предотвращение стандартной прокрутки страницы
    // event.preventDefault();

    let scaleLocal = scale;
    // Определение направления прокрутки
    const delta = event.deltaY;

    scaleLocal += delta > 0 ? -1 : 1;

    // Ограничение масштаба, чтобы он не стал слишком большим или маленьким
    scaleLocal = Math.min(Math.max(1, scaleLocal), 40);

    setScale(scaleLocal);
  }

  window.addEventListener('wheel', handleScroll);

  return (
    <div id="container">
      <div id="sun"></div>

      {planets.map((planet, key) => (
        <React.Fragment key={key}>
          <div id={`${planet.selector.toLowerCase()}-orbit`} className="orbit"></div>
          <div id={planet.selector.toLowerCase()} className="planet" onClick={() => handlePlanetClick(planet.selector)}></div>

          {planet.moons && planet.moons.map((moon, key) => (
            <div key={key} id={moon.selector.toLowerCase()} className="planet"></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
