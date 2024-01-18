import { Injectable, NotFoundException  } from '@nestjs/common';
import { Planet } from './planets';

@Injectable()
export class AppService {
  planets: Planet[] = [
    {
      selector: `mercury`,
      orbit: 39,
      speed: 4.17,
      radius: 5,
      degree: 0,
      radian: 0
    },
    {
      selector: `venus`,
      orbit: 72,
      speed: 1.61,
      radius: 5,
      degree: 0,
      radian: 0
    },
    {
      selector: `earth`,
      orbit: 100, // 1 ae
      speed: 1,
      radius: 5,
      degree: 0,
      radian: 0,
      moons: [{
          selector: 'moon',
          orbit: 10,
          speed: 12,
          radius: 3,
          degree: 0,
          radian: 0
      }]
    },
    {
      selector: `mars`,
      orbit: 152,
      speed: 0.53,
      radius: 5,
      degree: 0,
      radian: 0
    },
    {
      selector: `jupiter`,
      orbit: 520,
      speed: 0.08,
      radius: 20,
      degree: 0,
      radian: 0,
      moons: [
        {
            selector: 'io',
            orbit: 50,
            speed: 6,
            radius: 3,
            degree: 0,
            radian: 0
        },
        {
            selector: 'europe',
            orbit: 70,
            speed: 3,
            radius: 3,
            degree: 0,
            radian: 0
        },
      ]
    },
    {
      selector: `saturn`,
      orbit: 958,
      speed: 0.034,
      radius: 20,
      degree: 0,
      radian: 0
    },
    {
      selector: `uranus`,
      orbit: 1922,
      speed: 0.012,
      radius: 5,
      degree: 0,
      radian: 0
    },
    {
      selector: `neptune`,
      orbit: 3005,
      speed: 0.006,
      radius: 10,
      degree: 0,
      radian: 0
    },
    {
      selector: `pluto`,
      a: 3950,
      b: 3827,
      c: 948,
      orbit: 3005,
      speed: 1,
      radius: 5,
      degree: 0,
      radian: 0
    }
  ];

  getAll(): Planet[] {
    return this.planets;
  }

  getOne(planetName: string): Planet {
    const planet: Planet | null = this.planets.find(planet => planet.selector === planetName);

    if (!planet) {
      throw new NotFoundException(`Planet with name ${planetName} not found`);
    }

    return planet;
  }
}
