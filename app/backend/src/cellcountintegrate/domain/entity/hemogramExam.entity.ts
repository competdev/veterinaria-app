import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { IndicatorEntity } from "../entity";
import { UserEntity } from "../entity";
import { DocumentEntity } from "../entity";

@Entity()
export class HemogramExamEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column({ nullable: true })
	cellCount: number;

	@OneToMany(() => HemogramExamDocumentEntity, (hemogramExamDocument) => hemogramExamDocument.hemogramExam, {
		eager: true,
	})
	hemogramExamDocuments: HemogramExamDocumentEntity[];

	@ManyToOne(() => UserEntity)
	user: Promise<UserEntity>;

	@ManyToOne(() => IndicatorEntity, {
		eager: true,
	})
	status: IndicatorEntity;
}

// @Entity()
// export class HemogramExamDocumentEntity {

//     @PrimaryColumn({ type: 'int', name: 'hemogramExamId' })
//     @ManyToOne(() => HemogramExamEntity, {})
//     public hemogramExam: HemogramExamEntity;

//     @PrimaryColumn({ type: 'int', name: 'documentId' })
//     @ManyToOne(() => DocumentEntity, {
//         eager: true,
//         nullable: true
//     })
//     public document: DocumentEntity;

//     @Column({default: false})
//     isResult: boolean;
// }

@Entity()
export class HemogramExamDocumentEntity {
    @PrimaryColumn()
    hemogramExamId: number;

    @PrimaryColumn()
    documentId: number;

    @ManyToOne(type => HemogramExamEntity, hemogramExam => hemogramExam.id)
    @JoinColumn({ name: "hemogramExamId" })
    public hemogramExam!: HemogramExamEntity;

    @ManyToOne(type => DocumentEntity, document => document.id)
    @JoinColumn({ name: "documentId" })
    public document!: DocumentEntity;

	@Column({ default: false })
	isResult: boolean;
}