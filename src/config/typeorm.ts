import { registerAs } from '@nestjs/config';
import {config, config as dotenvConfig} from "dotenv"
import { DataSource, DataSourceOptions } from 'typeorm';


config()



// Import helpers to load environment variables and set up TypeORM


// Load environment variables based on current NODE_ENV (e.g., .env.development or .env.production)
// dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
dotenvConfig();

// 🔹 Common configuration used by both runtime and migration setups
const commonConfig = {
  type: 'postgres', // Database type
  host: process.env.DB_HOST, // Database host
  port: parseInt(process.env.DB_PORT, 10), // Database port
  username: process.env.DB_USER, // Database username
  password: process.env.DB_PASS, // Database password
  database: process.env.DB_NAME, // Database name
  synchronize: true, // Disable auto sync (recommended in production)
};

// 🔸 Runtime configuration used when running the app normally
const runtimeConfig = {
  ...commonConfig, // Spread common DB config
  entities: ['dist/**/*.entity{.ts,.js}'], // Load entities from compiled dist folder
  migrations: ['dist/migrations/*{.ts,.js}'], // Load migrations from compiled dist folder
  autoLoadEntities: false, // Do not auto-load entities (use explicit imports in modules)
};

// 🔸 Migration configuration used when generating or running migrations
const migrationConfig = {
  ...commonConfig, // Spread common DB config
  entities: ['src/**/*.entity{.ts,.js}'], // Use source `.ts` entities (before build)
  migrations: ['src/migrations/*{.ts,.js}'], // Generate or run migrations in src folder
  autoLoadEntities: true, // Allow auto loading of entities (helpful for CLI operations)
  logging: false, // Enable query logging during migration
};

// 🔹 Export runtime config for NestJS using `@nestjs/config` module
export default registerAs('typeorm', () => runtimeConfig);

// 🔹 Export TypeORM DataSource instance for CLI commands like `migration:generate` or `migration:run`
export const connectionSource = new DataSource(
  migrationConfig as DataSourceOptions
);

// 🔹 Export configuration in SeederOptions format for seeding tools (like typeorm-extension)
// export const typeOrmConfig = migrationConfig as SeederOptions;
