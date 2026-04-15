export interface Product {
  id: number
  name: string
  price: number // in DZD
  description: string
  category: string
  emoji: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Customer {
  firstName: string
  lastName: string
  email: string
  phone: string
  wilaya: string
  address: string
}

export interface Order {
  id: string
  orderNumber: string // sent to SATIM
  items: CartItem[]
  customer: Customer
  total: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  satimOrderId?: string // returned by SATIM after confirmation
  errorMessage?: string
  createdAt: Date
}

export interface SatimRegisterResponse {
  errorCode: string
  errorMessage?: string
  orderId?: string
  formUrl?: string
}

export interface SatimConfirmResponse {
  ErrorCode: number | string
  ErrorMessage?: string
  OrderStatus?: number
  actionCodeDescription?: string
  respCode?: string
  params?: {
    respCode_desc?: string
  }
}
