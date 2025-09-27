import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsString({
        message: 'The email must be a string',
    })
    @IsNotEmpty({
        message: 'The email must not be empty',
    })
    email!: string;

    @IsString({
        message: 'The password must be a string',  
    })
    @IsNotEmpty({
        message: 'The password must not be empty',
    })
    password!: string;
}

export class RegisterDTO {
    @IsString({
        message: 'The username must be a string',
    })
    @IsNotEmpty({
        message: 'The username must not be empty',
    })
    username!: string;

    @IsString({
        message: 'The email must be a string',
    })
    @IsNotEmpty({
        message: 'The email must not be empty',
    })
    email!: string;

    @IsString({
        message: 'The password must be a string',  
    })
    @IsNotEmpty({
        message: 'The password must not be empty',
    })
    password!: string;
}