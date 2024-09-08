import { RolesEnum } from "../../indicator";

export const FixLazyLoadingProps = (target: Object): Object => {

    Object.keys(target).forEach(key => {
        if(key.substring(0,2) === '__'){
            delete target[key]
        }
    })

    return target
}

export const CheckAccessPermissionOnObject = (objectOwner: number, req): boolean => {
    const currentUserId = req.user.id;
    const isAdmin = req.roles.some(role => role.id === RolesEnum.ADMIN_ROLE && role.active);

    return objectOwner === currentUserId || isAdmin
}