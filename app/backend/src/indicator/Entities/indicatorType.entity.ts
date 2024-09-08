import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class IndicatorTypeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    description: string;

    @Column({default: true})
    active: boolean;
}