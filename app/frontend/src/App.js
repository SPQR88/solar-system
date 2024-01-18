// import logo from './logo.svg';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './css/style.css';

function App() {
  const [scale, setScale] = useState(10);
  const [asteroids, setAsteroids] = useState([]);
  const [planets, setPlanets] = useState([]);

  const scaleRef = useRef(scale);
  const asteroidsRef = useRef(asteroids);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await fetch('http://localhost:3000');
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
    // console.log(`change scale ${scale}`);
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
    x: 400,
    y: 400,
    radius: 10
  }

  const init = () => {
    console.log(`init: ${planets}`);
    sun.x = parseInt(document.querySelector('#container').offsetWidth / 2);
    sun.y = parseInt(document.querySelector('#container').offsetHeight / 2);
    document.querySelector(`#sun`).style.top = Math.floor(sun.y - sun.radius) + 'px';
    document.querySelector(`#sun`).style.left = Math.floor(sun.x - sun.radius) + 'px';
    document.querySelector(`#sun`).style.width = Math.floor(sun.radius * 2 + 1) + 'px';
    document.querySelector(`#sun`).style.height = Math.floor(sun.radius * 2 + 1) + 'px';

    planets.forEach((item, key) => {
        let planetOrbit = document.querySelector(`#${item.selector}-orbit`);
        let planet = document.querySelector(`#${item.selector}`);
        // let pd = document.querySelector(`#${item.selector}-orbit-pd`);
        // let zindex = (key + 1) * 10

        planet.style.width = parseInt(1 + item.radius * 2) + 'px';
        planet.style.height = parseInt(1 + item.radius * 2) + 'px';

        let orbit = Math.round(item.orbit * scale / 10);
        planetOrbit.style.top = parseInt(sun.y - orbit) + 'px'
        planetOrbit.style.left = parseInt(sun.x - orbit) + 'px'
        planetOrbit.style.width = parseInt(orbit * 2 + 1) + 'px'
        planetOrbit.style.height = parseInt(orbit * 2 + 1) + 'px'
        //planet.style['z-index'] = zindex
    });
  }

  const intervalFunc = function() {
    const scale = scaleRef.current;
    planets.forEach((item) => {
      let planet = document.querySelector(`#${item.selector}`);

      item.degree += item.speed;
      item.radian = item.degree * Math.PI / 180;

      if (item.a && item.b && item.c) {
          const posX = Math.round(sun.x + item.a * Math.cos(item.radian) * scale / 10 + item.c * scale / 10);
          const posY =  Math.round(sun.y - item.b * Math.sin(item.radian) * scale / 10);
          planet.style.left = posX - item.radius + 'px';
          planet.style.top  = posY - item.radius + 'px';
      } else {
          const posX = Math.round(sun.x + item.orbit * Math.cos(item.radian) * scale / 10);
          const posY = Math.round(sun.y - item.orbit * Math.sin(item.radian) * scale / 10);
          planet.style.left = posX - item.radius + 'px';
          planet.style.top  = posY - item.radius + 'px';

          if (item.moons) {
              item.moons.forEach((moon) => {
                  let moonObj = document.querySelector(`#${moon.selector}`);
                  // console.log(moonObj);
                  moon.degree += moon.speed;
                  moon.radian = moon.degree * Math.PI / 180;
                  const posMoonX = Math.round(posX  + moon.orbit * Math.cos(moon.radian) * scale / 10);
                  const posMoonY = Math.round(posY - moon.orbit * Math.sin(moon.radian) * scale / 10);
                  moonObj.style.left = posMoonX - moon.radius + 'px';
                  moonObj.style.top = posMoonY - moon.radius + 'px';
                  moonObj.style.width = moon.radius * 2 + 1 + 'px';
                  moonObj.style.height = moon.radius * 2 + 1 + 'px';
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
            // Рандомное расстояние от 210 до 330 пикселей
            const distance = Math.random() * (330 - 210) + 210;

            // Рассчитываем координаты x и y астероида
            const x = sun.x + distance * Math.cos(Math.PI * i / 180);
            const y = sun.y - distance * Math.sin(Math.PI * i / 180);
            asteroids.push({i, j, distance})
            // setAsteroids(asteroids.push({i, j, distance}));

            // Создаем div элемент для астероида
            const asteroid = document.createElement('div');
            asteroid.id = 'asteroid-' + i + '-' + j; // Задаем уникальный ID
            asteroid.className = 'asteroid';
            asteroid.style.left = `${x}px`;
            asteroid.style.top = `${y}px`;
            asteroid.style.position = 'absolute';
            asteroid.style.width = '4px';
            asteroid.style.height = '4px';
            asteroid.style.backgroundColor = 'gray';
            asteroid.style.borderRadius = '50%';

            // Добавляем астероид на страницу
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
          const x = Math.floor(sun.x + asteroid.distance * Math.cos(asteroid.i * Math.PI / 180) * scale / 10);
          const y = Math.floor(sun.y - asteroid.distance * Math.sin(asteroid.i * Math.PI / 180) * scale / 10);
          obj.style.left = `${x}px`;
          obj.style.top = `${y}px`;
      // }
    }
  }

  function handleScroll(event) {
    // Предотвращение стандартной прокрутки страницы
    // event.preventDefault();

    let scaleLocal = scale;
    // Определение направления прокрутки
    const delta = event.deltaY;

    // Изменение масштаба
    // Уменьшение масштаба при прокрутке вниз, увеличение - при прокрутке вверх
    if (delta > 0) {
      scaleLocal -= +1;
    } else {
      scaleLocal += +1;
    }
    // console.log(scale);

    // Ограничение масштаба, чтобы он не стал слишком большим или маленьким
    scaleLocal = Math.min(Math.max(1, scaleLocal), 40);

    setScale(scaleLocal);
  }

  // Добавление обработчика событий прокрутки к элементу или окну
  window.addEventListener('wheel', handleScroll);

  return (
    <div id="container">
      <div id="sun"></div>

      <div id="mercury-orbit" className="orbit"></div>
      <div id="mercury" className="planet"></div>

      <div id="venus-orbit" className="orbit"></div>
      <div id="venus" className="planet"></div>
      
      <div id="earth-orbit"  className="orbit"></div>
      <div id="earth" className="planet"></div>
          <div id="moon" className="planet"></div>

      <div id="mars-orbit"  className="orbit"></div>
      <div id="mars" className="planet"></div>

      <div id="jupiter-orbit"  className="orbit"><div></div></div>
      <div id="jupiter" className="planet"></div>
          <div id="io" className="planet"></div>
          <div id="europe" className="planet"></div>
      
      <div id="saturn-orbit"  className="orbit"></div>
      <div id="saturn" className="planet"></div>

      <div id="uranus-orbit"  className="orbit"></div>
      <div id="uranus" className="planet"></div>

      <div id="neptune-orbit"  className="orbit"></div>
      <div id="neptune" className="planet"></div>

      <div id="pluto-orbit"  className="orbit"></div>
      <div id="pluto" className="planet"></div>
    </div>
  );
}

export default App;
