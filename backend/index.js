import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference } from 'mercadopago';




// Configura dotenv
dotenv.config();

// Importa las rutas
import productoRoutes from './routes/productoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-2055504621819056-091312-f69464a296bb3082aff74db46ba41a0a-74610892'
});

// Definición de rutas
app.use('/api/productos', productoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.post('/api/create_preference', async (req, res) => {
  try {
      const preference = new Preference(client);
      const result = await preference.create({
          body: {
              items: req.body.items,
              back_urls: {
                  success: "https://vision-digital.vercel.app/formulario-envio.html", // Actualizado
                  failure: "http://localhost:3000/carrito.html",
                  pending: "http://localhost:3000/carrito.html"
              },
              auto_return: "approved",
          }
      });
      res.json({ id: result.id });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// Ruta raíz opcional (para fines de prueba)
app.get('/', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
