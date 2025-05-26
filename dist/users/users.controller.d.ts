import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").UserEntity>;
    updateProfile(req: any, body: {
        name: string;
        email: string;
    }): Promise<import("./user.entity").UserEntity>;
}
