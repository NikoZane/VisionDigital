// Importa el módulo Sequelize para manejar la conexión con la base de datos
import {Sequelize} from "sequelize";
// Importa el módulo pg para configurar el uso de PostgreSQL con Sequelize
import pg from "pg";
// Importa la función config de dotenv para cargar las variables de entorno desde un archivo .env
import {config} from "dotenv";
config(); // Ejecuta la función para cargar las variables de entorno

// Configuración de la base de datos
const bd = new Sequelize({
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  dialectModule: pg,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function conectarBD() {
  try {
    // Conectar al servidor de base de datos
    await bd.authenticate();
    console.log('Connection has been established successfully.');

    // Crear la base de datos si no existe (si se prefiere)
    // await bd.query('CREATE DATABASE IF NOT EXISTS ecommerce');
    // console.log('Database created or already exists.');

    // Re-conectar a la base de datos
    bd.config.database = 'ecommerce'; // Cambiar la base de datos a la recién creada
    await bd.authenticate();
    console.log('Reconnected to the database successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
export { bd, conectarBD };

