import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

// --- Products ---
apiRouter.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { order: 'asc' } });
  res.json(products);
});
apiRouter.post('/products', async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.json(product);
});
apiRouter.put('/products/:id', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(product);
});
apiRouter.delete('/products/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- Categories ---
apiRouter.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
  res.json(categories);
});
apiRouter.post('/categories', async (req, res) => {
  const category = await prisma.category.create({ data: req.body });
  res.json(category);
});
apiRouter.put('/categories/:id', async (req, res) => {
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(category);
});
apiRouter.delete('/categories/:id', async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- Branches ---
apiRouter.get('/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});
apiRouter.post('/branches', async (req, res) => {
  const branch = await prisma.branch.create({ data: req.body });
  res.json(branch);
});

// --- Orders ---
apiRouter.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});
apiRouter.post('/orders', async (req, res) => {
  const { items, ...orderData } = req.body;
  const order = await prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items
      }
    },
    include: { items: true }
  });
  
  // Notify via Websocket
  io.to('orders').emit('postgres_changes', {
    eventType: 'INSERT',
    new: order,
  });

  res.json(order);
});
apiRouter.put('/orders/:id', async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: req.body,
    include: { items: true }
  });

  // Notify via Websocket
  io.to('orders').emit('postgres_changes', {
    eventType: 'UPDATE',
    new: order,
  });

  res.json(order);
});
apiRouter.delete('/orders/history', async (req, res) => {
  const branchId = req.query.branchId as string;
  await prisma.order.deleteMany({
    where: {
      branchId: branchId,
      status: { in: ['finalizado', 'cancelado'] }
    }
  });
  res.json({ success: true });
});

// --- Reviews ---
apiRouter.get('/reviews', async (req, res) => {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(reviews);
});
apiRouter.post('/reviews', async (req, res) => {
  const review = await prisma.review.create({ data: req.body });
  res.json(review);
});
apiRouter.delete('/reviews/:id', async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
apiRouter.delete('/reviews', async (req, res) => {
  const type = req.query.type as string;
  if (type === 'negative') {
    await prisma.review.deleteMany({
      where: { rating: { lte: 2 } }
    });
  } else {
    await prisma.review.deleteMany();
  }
  res.json({ success: true });
});

app.use('/api', apiRouter);

// Serve Static Frontend (when deployed)
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    next();
  }
});

// Socket.io for Realtime Orders
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_orders', () => {
    socket.join('orders');
    console.log(`User ${socket.id} joined orders channel`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
