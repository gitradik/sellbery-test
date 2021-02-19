import { Controller, Get, Post, Param, Body, Delete, Put, Query } from '@nestjs/common';
import { UsersService, User, UserQuery } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private us: UsersService) {}
    @Get()
    getAll(@Query() query?: UserQuery): Promise<User[]> {
        return this.us.getUsers(query);
    }

    @Post()
    create(@Body() user: any): Promise<User> {
        return this.us.createUser(user);
    }

    @Put('/:id')
    update(@Param('id') id: string, @Body() user: any): Promise<User> {
        return this.us.updateUser(+id, user);
    }

    @Delete('/:id')
    delete(@Param('id') id: string): Promise<{ id: number, result: boolean }> {
        return this.us.removeUser(+id);
    }
}
