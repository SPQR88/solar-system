/*let mars = {
    selector: `mars`,
    obj: document.querySelector('#mars-orbit div'),
    radius: 100,
    speed: 0.005,
    width: 6,
    radian: 0
}*/

let jupiter = {
    selector: `jupiter`,
    obj: document.querySelector('#jupiter-orbit div'),
    radius: 200,
    speed: 0.002,
    width: 10,
    radian: 0
}

let planets = [/*mars,*/ jupiter]

planets.forEach((item, key) => {
    let planetOrbit = document.querySelector(`#${item.selector}-orbit`);
    let planet = document.querySelector(`#${item.selector}-orbit div`);
    let pd = document.querySelector(`#${item.selector}-orbit-pd`);
    let zindex = (key + 1) * 10

    planetOrbit.style.top = parseInt(400 - item.radius) + 'px'
    planetOrbit.style.left = parseInt(400 - item.radius) + 'px'
    planetOrbit.style.width = parseInt(item.radius * 2) + 'px'
    planetOrbit.style.height = parseInt(item.radius * 2) + 'px'
    //planet.style['z-index'] = zindex

    pd.style.top = parseInt(400 - item.radius + 15) + 'px'
    pd.style.left = parseInt(400 - item.radius + 15) + 'px'
    pd.style.width = parseInt(item.radius * 2 - 30) + 'px'
    pd.style.height = parseInt(item.radius * 2 - 30) + 'px'
})


setInterval(() => {
    planets.forEach((item) => {
        let planet = document.querySelector(`#${item.selector}-orbit div`);
        item.radian += item.speed
        planet.style.left = item.radius + item.radius * Math.cos(item.radian) - item.width/2 + 'px'
        planet.style.top = item.radius - item.radius * Math.sin(item.radian) - item.width/2 + 'px'
    })
}, 5)

//let marsOrbit = document.querySelector('#mars-orbit');
let jupiterOrbit = document.querySelector('#jupiter-orbit');

const sun = document.querySelector('#sun');
sun.addEventListener("click", event => {
    console.log('Sun click')
});

/*marsOrbit.addEventListener("click", event => {
    console.log('Mars click')
});*/

jupiterOrbit.addEventListener("click", event => {
    console.log('Jupiter click')
});