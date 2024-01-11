const sun = {
    x: 400,
    y: 400,
}

let mars = {
    selector: `mars`,
    // obj: document.querySelector('#mars-orbit div'),
    orbit: 100,
    speed: 0.5,
    radius: 5,
    degree: 0,
    radian: 0
}

let jupiter = {
    selector: `jupiter`,
    orbit: 200,
    speed: 0.5,
    radius: 5,
    degree: 0,
    radian: 0
}

let planets = [mars, jupiter]

planets.forEach((item, key) => {
    let planetOrbit = document.querySelector(`#${item.selector}-orbit`);
    let planet = document.querySelector(`#${item.selector}`);
    // let pd = document.querySelector(`#${item.selector}-orbit-pd`);
    // let zindex = (key + 1) * 10

    planet.style.width = parseInt(1 + item.radius * 2) + 'px';
    planet.style.height = parseInt(1 + item.radius * 2) + 'px';

    planetOrbit.style.top = parseInt(sun.x - item.orbit) + 'px'
    planetOrbit.style.left = parseInt(sun.y - item.orbit) + 'px'
    planetOrbit.style.width = parseInt(item.orbit * 2 + 1) + 'px'
    planetOrbit.style.height = parseInt(item.orbit * 2 + 1) + 'px'
    //planet.style['z-index'] = zindex

    // pd.style.top = parseInt(400 - item.radius + 15) + 'px'
    // pd.style.left = parseInt(400 - item.radius + 15) + 'px'
    // pd.style.width = parseInt(item.radius * 2 - 30) + 'px'
    // pd.style.height = parseInt(item.radius * 2 - 30) + 'px'
})


setInterval(() => {
    planets.forEach((item) => {
        let planet = document.querySelector(`#${item.selector}`);

        item.degree += item.speed;
        item.radian = item.degree * Math.PI / 180;
        const left = Math.round(sun.x + item.orbit * Math.cos(item.radian));
        const top =  Math.round(sun.y - item.orbit * Math.sin(item.radian));
        planet.style.left = left - item.radius + 'px';
        planet.style.top  = top - item.radius + 'px';

        // if (item.degree % 90 === 0) {
        //     console.log(item.degree % 360, left, top);
        // }
    })
}, 10)

//let marsOrbit = document.querySelector('#mars-orbit');
// let jupiterOrbit = document.querySelector('#jupiter-orbit');

// const sun = document.querySelector('#sun');
// sun.addEventListener("click", event => {
//     console.log('Sun click')
// });

/*marsOrbit.addEventListener("click", event => {
    console.log('Mars click')
});*/

// jupiterOrbit.addEventListener("click", event => {
//     console.log('Jupiter click')
// });
