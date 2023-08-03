import { DataSourceOptions,DataSource } from "typeorm";


export const dataSourceOptions: DataSourceOptions={
    type: 'postgres',
        host: 'localhost',
        port: 5432,
        password: '123456',
        username: 'postgres',
        entities: ['dist/**/*.entity.js'],
        migrations: ["dist/**/*.entity{.ts,.js}"],
        database: 'TableTest',
        synchronize: false,
        logging: true,
}

const databaseSource = new DataSource(dataSourceOptions);
export default databaseSource;