import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryColumn('varchar', { length: 36 })
    id!: string;

    @Column('varchar', { length: 255 })
    name!: string;

    @Column('varchar', { length: 255, unique: true })
    email!: string;

    @CreateDateColumn({ name: 'registration_date' })
    registrationDate!: Date;
}
