import type { SatimRegisterResponse, SatimConfirmResponse } from './types'

const MOCK_MODE = process.env.SATIM_MOCK_MODE === 'true'
const TEST_MODE = process.env.SATIM_TEST_MODE !== 'false'

const SATIM_REGISTER_URL = TEST_MODE
  ? 'https://test.satim.dz/payment/rest/register.do'
  : 'https://epg.satim.dz/payment/rest/register.do'

const SATIM_CONFIRM_URL = TEST_MODE
  ? 'https://test.satim.dz/payment/rest/confirmOrder.do'
  : 'https://epg.satim.dz/payment/rest/confirmOrder.do'

const SATIM_REFUND_URL = TEST_MODE
  ? 'https://test.satim.dz/payment/rest/refund.do'
  : 'https://epg.satim.dz/payment/rest/refund.do'

export { SATIM_REGISTER_URL, SATIM_CONFIRM_URL, SATIM_REFUND_URL }

// Prefix used to identify mock SATIM order IDs
export const MOCK_ORDER_PREFIX = 'MOCK_'

interface RegisterParams {
  orderNumber: string
  amount: number // in DZD — will be multiplied by 100
  returnUrl: string
  failUrl: string
  language?: string
}

export async function satimRegisterOrder(params: RegisterParams): Promise<SatimRegisterResponse> {
  // ── Mock mode ──────────────────────────────────────────────────────────────
  if (MOCK_MODE) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    return {
      errorCode: '0',
      orderId: MOCK_ORDER_PREFIX + params.orderNumber,
      formUrl:
        `${baseUrl}/payment/test` +
        `?order_id=${params.orderNumber}` +
        `&amount=${params.amount}` +
        `&returnUrl=${encodeURIComponent(params.returnUrl)}` +
        `&failUrl=${encodeURIComponent(params.failUrl)}`,
    }
  }

  // ── Production ─────────────────────────────────────────────────────────────
  const userName = process.env.SATIM_USERNAME
  const password = process.env.SATIM_PASSWORD
  const terminalId = process.env.SATIM_TERMINAL_ID

  if (!userName || !password || !terminalId) {
    throw new Error('Identifiants SATIM manquants. Veuillez configurer le fichier .env.local')
  }

  const searchParams = new URLSearchParams({
    userName,
    password,
    orderNumber: params.orderNumber,
    currency: '012', // DZD
    amount: String(Math.round(params.amount * 100)),
    language: params.language ?? 'FR',
    returnUrl: params.returnUrl,
    failUrl: params.failUrl,
    jsonParams: JSON.stringify({
      force_terminal_id: terminalId,
      udf1: '2018105301346',
    }),
  })

  const response = await fetch(`${SATIM_REGISTER_URL}?${searchParams.toString()}`, {
    method: 'GET',
    signal: AbortSignal.timeout(60_000),
  })

  if (!response.ok) {
    throw new Error(`Erreur HTTP SATIM: ${response.status}`)
  }

  return response.json() as Promise<SatimRegisterResponse>
}

export async function satimConfirmOrder(
  satimOrderId: string,
  language = 'FR'
): Promise<SatimConfirmResponse> {
  // ── Mock mode ──────────────────────────────────────────────────────────────
  if (satimOrderId.startsWith(MOCK_ORDER_PREFIX)) {
    return { ErrorCode: 0, ErrorMessage: 'Mock confirmation success' }
  }

  // ── Production ─────────────────────────────────────────────────────────────
  const userName = process.env.SATIM_USERNAME
  const password = process.env.SATIM_PASSWORD

  if (!userName || !password) {
    throw new Error('Identifiants SATIM manquants.')
  }

  const searchParams = new URLSearchParams({
    userName,
    password,
    orderId: satimOrderId,
    language,
  })

  const response = await fetch(`${SATIM_CONFIRM_URL}?${searchParams.toString()}`, {
    method: 'GET',
    signal: AbortSignal.timeout(60_000),
  })

  if (!response.ok) {
    throw new Error(`Erreur HTTP SATIM: ${response.status}`)
  }

  return response.json() as Promise<SatimConfirmResponse>
}
