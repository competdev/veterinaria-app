import * as dbConstants from 'db.constants';

export enum RolesEnum {
    ADMIN_ROLE = dbConstants.indicators.role.ADMIN_ROLE,
    PROFESSOR_ROLE = dbConstants.indicators.role.PROFESSOR_ROLE,
    STUDENT_ROLE = dbConstants.indicators.role.STUDENT_ROLE
}

export enum StatusEnum {
    AWAITING = dbConstants.indicators.status.AWAITING,
    READY = dbConstants.indicators.status.READY,
    RUNNING = dbConstants.indicators.status.RUNNING,
    FINISHED = dbConstants.indicators.status.FINISHED,
    SUCCESS = dbConstants.indicators.status.SUCCESS,
    FAILED = dbConstants.indicators.status.FAILED
}