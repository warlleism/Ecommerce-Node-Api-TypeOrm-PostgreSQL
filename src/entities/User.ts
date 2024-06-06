import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    email: string

    @Column({ type: 'text' })
    password: string
}