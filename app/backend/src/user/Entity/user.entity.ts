import { HashPassowrd } from 'src/utils';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    EventSubscriber,
    EntitySubscriberInterface,
    Connection,
    InsertEvent,
    UpdateEvent
} from 'typeorm';
import { IndicatorEntity } from '../../indicator';

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column({ select: false })
    password: string;

    @Column({default: true})
    active: boolean;

    @ManyToMany(() => IndicatorEntity)
    @JoinTable({
        name: 'user_role_entity',
        inverseJoinColumn: {
            name: 'roleEntityId'
        }
    })
    roles: Promise<IndicatorEntity[]>
}

@EventSubscriber()
export class UserEntitySubscriber implements EntitySubscriberInterface<UserEntity> {

    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return UserEntity
    }

    async beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
        event.entity['password'] = await HashPassowrd(event.entity['password'])
    }

    async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
        if(event.entity['password']){
            event.entity['password'] = await HashPassowrd(event.entity['password'])
        }
    }
}