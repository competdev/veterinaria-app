import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { IndicatorTypeEntity } from './indicatorType.entity';

@Entity()
export class IndicatorEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @Column()
    description: string;

    @Column({default: true})
    active: boolean;

    @ManyToOne(() => IndicatorTypeEntity)
    indicatorType: Promise<IndicatorTypeEntity>; 
}