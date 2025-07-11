// import { s } from 'src/utils/common/user-roles.enum';
import { UserType } from '../../utils/user-type';
import {SetMetadata} from '@nestjs/common'

// console.log(ro);
    

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);