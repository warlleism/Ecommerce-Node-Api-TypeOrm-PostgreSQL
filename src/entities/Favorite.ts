import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('favorites')

export class Favorite {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    user_id: number

    @Column({ type: 'text' })
    product_id: number

}