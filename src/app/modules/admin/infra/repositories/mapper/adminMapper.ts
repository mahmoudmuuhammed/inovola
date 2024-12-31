import { Admin } from './../../../domain/admin';
import { Mapper } from '../../../../../../common/types';
import { AdminEntity } from '../entities/adminEntity';

export type AdminMapper = Mapper<AdminEntity, Admin>;
