import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IndicatorEntity } from '../../indicator';
import { HemogramExamEntity } from '../../hemogram-exam/Entity/hemogramExam.entity';


@Entity()
export class JobEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    errorCount: number;

    @Column()
    retryCount: number;

    @Column({nullable:true})
    statusReason: string; 

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @ManyToOne(() => IndicatorEntity, {
        eager: true
    })
    status: IndicatorEntity; 
    
    @ManyToOne(() => HemogramExamEntity, {
        eager: true
    })
    hemogramExam: HemogramExamEntity; 
}