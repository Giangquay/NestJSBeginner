import { PartialType } from '@nestjs/mapped-types';
import { CreatePostinfoDto } from './create-postinfo.dto';

export class UpdatePostinfoDto extends PartialType(CreatePostinfoDto) {}
