import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { FileService } from '../file.service';
import { SortDirection } from '../utils';

export interface User {
    id: number;
    name: string;
    email: string;
    pass?: string;
}

export type UserSortBy = 'id' | 'name' | 'email';

export interface UserQuery {
  sortBy: UserSortBy;
  direction: SortDirection;
}

@Injectable()
export class UsersService {
    private readonly dataName = 'users';
    private readonly saltRounds = 10;

    constructor(private fs: FileService) {}

    async getUsers(query?: UserQuery): Promise<User[]> {
        try {
            const records = await this.fs.readRecords(this.dataName);
            let users = this.parseUsers(records);
            
            if (query) {
                users = this.sortUsers([...users], query);
            }

            return users;
        } catch (err) {
            console.log(err);
        }
    }

    async createUser(user: User): Promise<User> {
        try {
            const { pass } = user;

            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hashPass = await bcrypt.hash(pass, salt);

            user.pass = hashPass;

            const lastId = await this.fs.writeRecords(this.dataName, [user]);
            delete user.pass;

            return { id: lastId + 1, ...user };
        } catch (err) {
            console.log(err);
        }
    }

    async updateUser(id: number, user: User): Promise<User> {
        try {
            const updatedUser = await this.fs.updateRecord(this.dataName, id, user, 3);
            return { id, ...updatedUser };
        } catch (err) {
            console.log(err);
        }
    }

    async removeUser(id: number): Promise<{ id: number, result: boolean }> {
        try {
            const result = await this.fs.removeRecord(this.dataName, id);
            return { id, result };
        } catch (err) {
            console.log(err);
        }
    }

    private parseUsers(records: Array<any[]>): User[] {
        const arr = records.splice(1);
        return arr.map(str => ({
            id: str[0],
            name: str[1],
            email: str[2]
        }));
    }

    private sortUsers(users: User[], query: UserQuery): User[] {
        const { sortBy, direction } = query;

        return users.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                if (direction === 'asc') return -1;
                else if (direction === 'desc') return 1;
            }

            if (a[sortBy] > b[sortBy]) {
                if (direction === 'asc') return 1;
                else if (direction === 'desc') return -1;
            }

            return 0;
        });
    }
}
