import { ActionsEnum } from "../Enums"
import { Actions } from "../Types"

export const NotFoundLabel = (entity: string, isMaleGender: boolean = true): string => {

    return `${entity} não encontrad${isMaleGender ? 'o' : 'a'}`
} 

export const IndicatorNotFoundLabel = (indicator: string, isMaleGender: boolean = true): string => {

    return `${indicator} não encontrad${isMaleGender ? 'o' : 'a'}`
} 

export const NotActiveLabel = (entity: string, isMaleGender: boolean = true): string => {

    return `${entity} não esta ativ${isMaleGender ? 'o' : 'a'}`
} 

export const EntityAlreadyDeactivated = (entity: string, isMaleGender: boolean = true): string => {
    return `${entity} já esta desativ${isMaleGender ? 'o' : 'a'}`
} 

export const EntityAlreadyActivated = (entity: string, isMaleGender: boolean = true): string => {
    return `${entity} já esta ativ${isMaleGender ? 'o' : 'a'}`
} 

export const EntityNotActive = (entity: string, isMaleGender: boolean = true): string => {
    return `${entity} esta desativad${isMaleGender ? 'o' : 'a'}`
} 

export const DuplicatedProp = (prop: string): string => {

    return `${prop} já existe no banco`
} 

export const InvalidRole = (): string => {
    return `Role invalido`
}

export const EntityActionPerformed = (entity: string, action: Actions, isMaleGender: boolean = true): string => {
    let formatedAction = '';
    switch(action){
        case ActionsEnum.CREATE:
            formatedAction = `criad${isMaleGender ? 'o' : 'a'}`;
            break
        case ActionsEnum.DEACTIVATE:
            formatedAction = `desativad${isMaleGender ? 'o' : 'a'}`;
            break
        case ActionsEnum.ACTIVATE:
            formatedAction = `ativad${isMaleGender ? 'o' : 'a'}`;
            break
        case ActionsEnum.UPDATE:
        default:
            formatedAction = `atualizad${isMaleGender ? 'o' : 'a'}`;
            break
    }

    return `${entity} ${formatedAction} com sucesso`
} 

export const InvalidCredentials = (): string => {

    return `Credenciais Invalidas`
} 

export const InsuficientPernmissions = (): string => {

    return `Permissoes insuficientes`
} 


export const NothingToUpdate = (): string => {

    return `Nada para atualizar`
} 

export const NotImplemented = (): string => {

    return `Não iplementada`
}  

export const MaxTimeoutReached = (): string => {

    return `Max timeout reached`
} 