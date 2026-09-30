import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  photoUrl: text('photo_url'),
  address: text('address').default('Bandra West, Mumbai 400050'),
  escrowBalance: integer('escrow_balance').default(2500),
  createdAt: timestamp('created_at').defaultNow(),
});

// Produce Catalog Table
export const produceItems = pgTable('produce_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  badge: text('badge').notNull(),
  batchId: text('batch_id').notNull(),
  imageUrl: text('image_url').notNull(),
  harvestTime: text('harvest_time').notNull(),
  origin: text('origin').notNull(),
  farmer: text('farmer').notNull(),
  price: integer('price').notNull(),
  unit: text('unit').notNull(),
  growerSharePercent: integer('grower_share_percent').notNull(),
  distanceKm: integer('distance_km').notNull(),
  inStock: integer('in_stock').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userUid: text('user_uid'),
  date: text('date').notNull(),
  subtotal: integer('subtotal').notNull(),
  logisticsFee: integer('logistics_fee').notNull(),
  platformFee: integer('platform_fee').notNull(),
  discount: integer('discount').default(0),
  total: integer('total').notNull(),
  escrowStatus: text('escrow_status').notNull().default('Locked'),
  reeferTemp: text('reefer_temp').default('3.8°C'),
  slot: text('slot').notNull(),
  driverName: text('driver_name').notNull(),
  vanNumber: text('van_number').notNull(),
  eta: text('eta').notNull(),
  rating: integer('rating'),
  reviewComment: text('review_comment'),
  ratedAt: text('rated_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Order Items Table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  farmerName: text('farmer_name').notNull(),
});

// Farm Clusters Table
export const farmClusters = pgTable('farm_clusters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  region: text('region').notNull(),
  pin: text('pin').notNull(),
  status: text('status').notNull(),
  farmersCount: integer('farmers_count').notNull(),
  leadFarmer: text('lead_farmer').notNull(),
  leadFarmerAvatar: text('lead_farmer_avatar').notNull(),
  bio: text('bio').notNull(),
  soilNpk: integer('soil_npk').notNull(),
  chemicalResiduePpm: text('chemical_residue_ppm').default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userUid],
    references: [users.uid],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
