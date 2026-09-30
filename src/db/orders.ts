import { db } from './index.ts';
import { orders, orderItems } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { OrderRecord } from '../types.ts';

export async function getAllOrders(): Promise<OrderRecord[]> {
  try {
    const dbOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allItems = await db.select().from(orderItems);

    return dbOrders.map((o) => {
      const items = allItems
        .filter((it) => it.orderId === o.id)
        .map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          farmerName: it.farmerName,
        }));

      return {
        id: o.id,
        date: o.date,
        items,
        subtotal: o.subtotal,
        logisticsFee: o.logisticsFee,
        platformFee: o.platformFee,
        discount: o.discount || 0,
        total: o.total,
        escrowStatus: o.escrowStatus as 'Locked' | 'Inspected & Released' | 'Refunded',
        reeferTemp: o.reeferTemp || '3.8°C',
        slot: o.slot,
        driverName: o.driverName,
        vanNumber: o.vanNumber,
        eta: o.eta,
        rating: o.rating || undefined,
        reviewComment: o.reviewComment || undefined,
        ratedAt: o.ratedAt || undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching orders from DB:', error);
    throw new Error('Failed to fetch orders from database', { cause: error });
  }
}

export async function createOrder(order: OrderRecord, userUid?: string) {
  try {
    await db.insert(orders).values({
      id: order.id,
      userUid: userUid || null,
      date: order.date,
      subtotal: Math.round(order.subtotal),
      logisticsFee: Math.round(order.logisticsFee),
      platformFee: Math.round(order.platformFee),
      discount: Math.round(order.discount),
      total: Math.round(order.total),
      escrowStatus: order.escrowStatus,
      reeferTemp: order.reeferTemp,
      slot: order.slot,
      driverName: order.driverName,
      vanNumber: order.vanNumber,
      eta: order.eta,
    });

    if (order.items && order.items.length > 0) {
      await db.insert(orderItems).values(
        order.items.map((it) => ({
          orderId: order.id,
          name: it.name,
          quantity: it.quantity,
          price: Math.round(it.price),
          farmerName: it.farmerName,
        }))
      );
    }

    return order;
  } catch (error) {
    console.error('Error saving order to DB:', error);
    throw new Error('Failed to save order to database', { cause: error });
  }
}

export async function updateOrderEscrow(orderId: string, status: 'Locked' | 'Inspected & Released' | 'Refunded') {
  try {
    await db.update(orders)
      .set({ escrowStatus: status })
      .where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error('Error updating order escrow in DB:', error);
    throw new Error('Failed to update order escrow in database', { cause: error });
  }
}

export async function updateOrderRating(orderId: string, rating: number, comment?: string) {
  try {
    await db.update(orders)
      .set({
        rating,
        reviewComment: comment || null,
        ratedAt: 'Just now',
      })
      .where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error('Error updating order rating in DB:', error);
    throw new Error('Failed to update order rating in database', { cause: error });
  }
}
