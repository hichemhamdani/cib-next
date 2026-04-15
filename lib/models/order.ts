import mongoose, { Schema, type Document } from 'mongoose'
import type { Order } from '@/lib/types'

export type OrderDocument = Omit<Order, 'id'> & Document

const CustomerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    wilaya: String,
    address: String,
  },
  { _id: false }
)

const CartItemSchema = new Schema(
  {
    product: {
      id: Number,
      name: String,
      price: Number,
      description: String,
      category: String,
      emoji: String,
      stock: Number,
    },
    quantity: Number,
  },
  { _id: false }
)

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
    customer: CustomerSchema,
    total: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    satimOrderId: String,
    errorMessage: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// Prevent model recompilation on hot reload
export const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDocument>) ??
  mongoose.model<OrderDocument>('Order', OrderSchema)
