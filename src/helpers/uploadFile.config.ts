import { PipeTransform,Injectable,ArgumentMetadata } from "@nestjs/common";

import * as path from 'path';

import * as sharp from 'sharp'

@Injectable()
export class FileSizeValidatonPipe implements PipeTransform<Express.Multer.File,Promise<string>> {


    async transform(image: Express.Multer.File, metadata: ArgumentMetadata): Promise<string> {
        const originalName = path.parse(image.originalname).name;//chua ten goc cua tep tin
        const filename = Date.now()+ '-'+originalName+'.webp' //Tao 1 file moi
        //
        await sharp(image.buffer).resize(800).webp({effort:3}).toFile(path.join('uploads', filename)
        ,(error,info)=>{
            if(error) throw error;
            console.log(info)
        });

        return filename;
    }
 

}