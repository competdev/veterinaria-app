import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { UserEntity } from '../entity';

@Entity()
export class DocumentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    fileHash: string;

    @Column()
    fileType: string; 

    @ManyToOne(() => UserEntity)
    user: Promise<UserEntity>; 
}