import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne
} from 'typeorm';
import { IndicatorEntity } from '../../indicator';
import { UserEntity } from '../../user';
import { DocumentEntity } from '../../document';

@Entity()
export class HemogramExamEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({nullable: true})
    cellCount: number; 

    @OneToMany(() => HemogramExamDocumentEntity, (hemogramExamDocument) => hemogramExamDocument.hemogramExam, {
        eager: true
    })
    hemogramExamDocuments: HemogramExamDocumentEntity[];

    @ManyToOne(() => UserEntity)
    user: Promise<UserEntity>;

    @ManyToOne(() => IndicatorEntity, {
        eager: true
    })
    status: IndicatorEntity; 
}

@Entity()
export class HemogramExamDocumentEntity {

    @ManyToOne(() => HemogramExamEntity, {
        primary: true
    })
    public hemogramExam: HemogramExamEntity;
    
    @ManyToOne(() => DocumentEntity, {
        primary: true,
        eager: true
    })
    public document: DocumentEntity;

    @Column({default: false})
    isResult: boolean;
}