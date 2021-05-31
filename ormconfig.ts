import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy';
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface';
import { snakeCase } from 'typeorm/util/StringUtils';
import config from './config';

class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName) + 's';
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_'),
    );
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

const SOURCE_PATH = config.ENV === 'production' ? 'dist/src' : 'src';

export default {
  type: config.DB_TYPE,
  url:
    process.env.DATABASE_URL ||
    `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}`,
  migrationsTableName: 'migration',
  entities: [`${SOURCE_PATH}/**/*.model{.ts,.js}`],
  migrations: [`${SOURCE_PATH}/migrations/*{.ts,.js}`],
  namingStrategy: new CustomNamingStrategy(),
  synchronize: false,
  logging: true,
  ssl: config.ENV === 'production' && {
    rejectUnauthorized: false,
  },
  cli: {
    migrationsDir: 'src/migrations',
  },
};
