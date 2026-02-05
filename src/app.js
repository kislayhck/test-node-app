const express = require('express');
const swaggerUi = require('swagger-ui-express');
const SwaggerParser = require('swagger-parser');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve raw OpenAPI JSON alongside the Swagger UI
app.get('/api-docs.json', (req, res) => {
  res.type('application/json').send(swaggerSpec);
});

// Serve fully dereferenced OpenAPI spec (for MCP and tools that don't handle $ref)
app.get('/api-docs-dereferenced.json', async (req, res) => {
  try {
    const dereferenced = await SwaggerParser.dereference(swaggerSpec);
    res.type('application/json').send(dereferenced);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dereference spec', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
