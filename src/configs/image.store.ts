import { diskStorage } from "multer";
import {v4 as uuidv4} from 'uuid'
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


const FileType = require('file-type');

const fs = import("fs");
import path = require("path");
import { Injectable } from "@nestjs/common";

@Injectable()
export class SaveImageToStorageFactory {
  
}
//Validate exp
type validFileExtension = 'png' | 'jpg' | 'jpeg';

type validMimeType = 'image/png'|'image/jpg'|'image/jpeg'

const validFileExtensions:validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes:validMimeType[] =[
    'image/png', 'image/jpg', 'image/jpeg'
]

export const saveImageToStorage ={
    storage: diskStorage({
        destination: `./images`,
        filename: (req, file, cb) => {
          const fileExtension: string = path.extname(file.originalname);
          const fileName: string = uuidv4() + fileExtension;
          cb(null, fileName);
        }
      }),
    fileFilter:(req, file, cb)=>{
        const allowedMimeTypes: validMimeType[] = validMimeTypes;
        allowedMimeTypes.includes(file.mimetype) ?cb(null,true):cb(null,false);
    },
    limits:{
        fileSize: 104857600,
        files:5
    } 
}