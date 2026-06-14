require('dotenv').config();
const { sequelize, Category, Product, User } = require('../models');

const categories = [
  { nombre: 'Electrónica' },
  { nombre: 'Ropa y Moda' },
  { nombre: 'Hogar y Jardín' },
  { nombre: 'Deportes' },
  { nombre: 'Alimentos' },
];

const users = [
  { email: 'admin@marketplace.com', password: 'Admin123!', role: 'ADMIN' },
  { email: 'customer@marketplace.com', password: 'Customer123!', role: 'CUSTOMER' },
  { email: 'juan@example.com', password: 'Password123!', role: 'CUSTOMER' },
];

async function seed() {
  await sequelize.authenticate();
  console.log('DB connected.');

  await sequelize.sync({ force: true });
  console.log('Tables created.');

  const createdCategories = await Category.bulkCreate(categories, { returning: true });
  console.log(`${createdCategories.length} categories inserted.`);

  // individualHooks: true is required so beforeCreate fires and passwords get hashed
  const createdUsers = await User.bulkCreate(users, { individualHooks: true, returning: true });
  console.log(`${createdUsers.length} users inserted.`);

  const electronics = createdCategories.find(c => c.nombre === 'Electrónica');
  const clothing = createdCategories.find(c => c.nombre === 'Ropa y Moda');
  const home = createdCategories.find(c => c.nombre === 'Hogar y Jardín');
  const sports = createdCategories.find(c => c.nombre === 'Deportes');
  const food = createdCategories.find(c => c.nombre === 'Alimentos');

  const products = [
    {
      nombre: 'Laptop HP Pavilion 15',
      precio: 2499.90,
      descripcion: 'Laptop 15.6" con procesador Intel Core i5-12th Gen, 16GB RAM, 512GB SSD.',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      CategoryId: electronics.id,
    },
    {
      nombre: 'Smartphone Samsung Galaxy S24',
      precio: 3299.00,
      descripcion: 'Pantalla Dynamic AMOLED 6.2", 256GB almacenamiento, cámara 50MP.',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      CategoryId: electronics.id,
    },
    {
      nombre: 'Auriculares Sony WH-1000XM5',
      precio: 999.90,
      descripcion: 'Auriculares inalámbricos con cancelación de ruido líder de la industria.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      CategoryId: electronics.id,
    },
    {
      nombre: 'Zapatillas Nike Air Max 270',
      precio: 449.90,
      descripcion: 'Zapatillas deportivas con cámara de aire Max, disponibles en tallas 36-45.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      CategoryId: clothing.id,
    },
    {
      nombre: 'Camiseta Polo Ralph Lauren',
      precio: 189.00,
      descripcion: 'Camiseta polo clásica 100% algodón piqué, múltiples colores disponibles.',
      imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
      CategoryId: clothing.id,
    },
    {
      nombre: 'Silla de Oficina Ergonómica',
      precio: 1299.00,
      descripcion: 'Silla ejecutiva con soporte lumbar ajustable, apoyabrazos 4D y respaldo de malla.',
      imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
      CategoryId: home.id,
    },
    {
      nombre: 'Cafetera Nespresso Vertuo',
      precio: 699.90,
      descripcion: 'Cafetera de cápsulas con tecnología Centrifusion, prepara café en 30 segundos.',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      CategoryId: home.id,
    },
    {
      nombre: 'Bicicleta Mountain Trek 820',
      precio: 1899.00,
      descripcion: 'Bicicleta de montaña con cuadro de aluminio, 21 velocidades, frenos de disco.',
      imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
      CategoryId: sports.id,
    },
    {
      nombre: 'Mancuernas Ajustables 20kg',
      precio: 349.90,
      descripcion: 'Set de mancuernas ajustables de 2 a 20kg, sistema de bloqueo rápido.',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      CategoryId: sports.id,
    },
    {
      nombre: 'Kit Sushi Premium',
      precio: 89.90,
      descripcion: 'Kit completo para preparar sushi en casa: esterilla, palillos, salsa de soya y más.',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
      CategoryId: food.id,
    },
  ];

  const createdProducts = await Product.bulkCreate(products);
  console.log(`${createdProducts.length} products inserted.`);

  console.log('\n=== SEED COMPLETED ===');
  console.log('Test credentials:');
  console.log('  ADMIN  → admin@marketplace.com / Admin123!');
  console.log('  CUSTOMER → customer@marketplace.com / Customer123!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
