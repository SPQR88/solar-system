import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Planet } from './planets';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/planets')
  getAll(): Planet[] {
    return this.appService.getAll();
  }

  @Get('/planets/:name')
  getOne(@Param('name') name: string): Planet {   
    return this.appService.getOne(name);
  }
}
