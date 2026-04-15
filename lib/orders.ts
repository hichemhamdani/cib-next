import { connectDB } from './mongodb'
import { OrderModel } from './models/order'
import type { Order } from './types'

export async function createOrder(order: Order): Promise<void> {
  await connectDB()
  await OrderModel.create({
    orderNumber: order.orderNumber,
    items: order.items,
    customer: order.customer,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  })
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  await connectDB()
  const doc = await OrderModel.findOne({ orderNumber }).lean()
  if (!doc) return null
  return {
    id: String(doc._id),
    orderNumber: doc.orderNumber,
    items: doc.items,
    customer: doc.customer,
    total: doc.total,
    status: doc.status,
    satimOrderId: doc.satimOrderId,
    errorMessage: doc.errorMessage,
    createdAt: doc.createdAt,
  } as Order
}

export async function updateOrder(
  orderNumber: string,
  updates: Partial<Order>
): Promise<void> {
  await connectDB()
  await OrderModel.updateOne({ orderNumber }, { $set: updates })
}

export function generateOrderId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 9000 + 1000).toString()
}
