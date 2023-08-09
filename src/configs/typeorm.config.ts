import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, } from "@nestjs/typeorm";



export default class TypeOrmConfig{

    static getOrmConfig(configService:ConfigService):TypeOrmModuleOptions{
        return {
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            password: configService.get('DATABASE_PASSWORD'),
            username: configService.get('DATABASE_USER'),
            entities: ['dist/**/*.entity.js'],
            // entities:[__dirname +'/../**/*.entity{.ts,js}'],
            database: configService.get('DB_NAME'),
            synchronize: true,
            logging: true,
            useUTC:true,
            
            }
    }
}

export const typeOrmConfigAsync :TypeOrmModuleAsyncOptions= {
    imports:[ConfigModule],
    useFactory :async(configService :ConfigService):Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
    inject:[ConfigService]
}

   