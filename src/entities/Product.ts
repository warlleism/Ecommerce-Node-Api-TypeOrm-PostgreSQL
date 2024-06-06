import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'text' })
    image: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'text' })
    price: number

    @Column({ type: 'text' })
    rate: number



}