import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @Column()
    name: string | undefined;

    @Column({ unique: true })
    email: string | undefined;

    @Column()
    password: string | undefined;
}
