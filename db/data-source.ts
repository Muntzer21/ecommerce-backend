import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/review/entities/review.entity';
import { Order } from 'src/order/entities/order.entity';
import { Shipping } from 'src/order/entities/shipping.entity';
import { OrdersProducts } from 'src/order/entities/order.products.entity';


config({
  path: '.env',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  entities: [User, Category, Product, Review,Order,Shipping,OrdersProducts],
  synchronize: true, // only in development environment
  migrations: ['dist/db/migrations/*{.js,.ts}'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

// export const databaseProviders: DynamicModule = TypeOrmModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: 'postgres',
//       database: config.get<string>('DB_DATABASE'),
//       username: config.get<string>('DB_USERNAME'),
//       password: config.get<string>('DB_PASSWORD'),
//       port: config.get<number>('DB_PORT'),
//       host: 'localhost',
//       synchronize: true, //only in development envirment
//         entities: ['dist/**/*.entity{.ts,.js}'],
//       migrations:['dist/db/migrations/*{.js,.ts}']
//     };
//   },
// });
