import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Order } from './types'

const C = {
  black: '#000000',
  white: '#ffffff',
  gray: '#555555',
  lightGray: '#f7f7f7',
  border: '#e0e0e0',
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 45,
    paddingVertical: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: C.black,
  },
  // ── Header ────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
  },
  companyBlock: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  companyAddress: {
    color: C.gray,
    fontSize: 8,
    lineHeight: 1.6,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: 'solid',
    marginBottom: 18,
  },
  // ── Section title ─────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 14,
  },
  // ── Two columns ───────────────────────────────────────────
  twoCol: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  leftCol: {
    flex: 1,
    paddingRight: 16,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 16,
  },
  customerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 4,
  },
  customerLine: {
    color: C.gray,
    fontSize: 8,
    marginBottom: 3,
    lineHeight: 1.5,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    width: 105,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  metaValue: {
    flex: 1,
    color: C.gray,
    fontSize: 8,
  },
  // ── Table ─────────────────────────────────────────────────
  table: {
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.black,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    color: C.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: 'solid',
  },
  colProduct: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  productName: {
    fontSize: 9,
  },
  productCategory: {
    fontSize: 7,
    color: C.gray,
    marginTop: 2,
  },
  // ── Totals ────────────────────────────────────────────────
  totalsWrapper: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 210,
  },
  totalLabel: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  totalValue: {
    fontSize: 9,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 210,
    borderTopWidth: 2,
    borderTopColor: C.black,
    borderTopStyle: 'solid',
    marginTop: 3,
  },
  grandTotalLabel: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  grandTotalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'right',
  },
  // ── Footer ────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 45,
    right: 45,
    textAlign: 'center',
    color: C.gray,
    fontSize: 7,
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
})

function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function fmtPrice(n: number) {
  return n.toLocaleString('fr-DZ') + ' DZD'
}

function invoiceNumber(orderNumber: string) {
  return 'INV-' + orderNumber.slice(-8).toUpperCase()
}

interface Props {
  order: Order
  companyName: string
  companyAddress: string
}

export function InvoicePDF({ order, companyName, companyAddress }: Props) {
  const subtotal = order.items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.logoText}>{companyName.toUpperCase()}</Text>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.companyAddress}>{companyAddress}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Section title ── */}
        <Text style={styles.sectionTitle}>Détails de la transaction</Text>

        {/* ── Two columns ── */}
        <View style={styles.twoCol}>
          {/* Customer info */}
          <View style={styles.leftCol}>
            <Text style={styles.customerName}>
              {order.customer.firstName} {order.customer.lastName}
            </Text>
            <Text style={styles.customerLine}>{order.customer.address}</Text>
            <Text style={styles.customerLine}>{order.customer.wilaya}, Algérie</Text>
            <Text style={styles.customerLine}>{order.customer.email}</Text>
            <Text style={styles.customerLine}>{order.customer.phone}</Text>
          </View>

          {/* Invoice metadata */}
          <View style={styles.rightCol}>
            {[
              ['Invoice Number:', invoiceNumber(order.orderNumber)],
              ['Invoice Date:', fmtDate(order.createdAt)],
              ['Order Number:', order.orderNumber.slice(-8).toUpperCase()],
              ['Order Date:', fmtDate(order.createdAt)],
              ['Payment Method:', 'Carte CIB / Dahabia'],
            ].map(([label, value]) => (
              <View key={label} style={styles.metaRow}>
                <Text style={styles.metaLabel}>{label}</Text>
                <Text style={styles.metaValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Products table ── */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colProduct]}>Product</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Price</Text>
          </View>

          {order.items.map(({ product, quantity }) => (
            <View key={product.id} style={styles.tableRow}>
              <View style={styles.colProduct}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
              </View>
              <Text style={styles.colQty}>{quantity}</Text>
              <Text style={styles.colPrice}>{fmtPrice(product.price * quantity)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ── */}
        <View style={styles.totalsWrapper}>
          {subtotal !== order.total && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{fmtPrice(subtotal)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{fmtPrice(order.total)}</Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <Text style={styles.footer}>
          {companyName} — Paiement sécurisé par carte CIB / Dahabia via SATIM
        </Text>

      </Page>
    </Document>
  )
}
