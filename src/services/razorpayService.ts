/**
 * Razorpay Standard Web Checkout Integration Service
 * Complies with official Razorpay Standard Checkout specification:
 * 1. Calls /api/create-order to create order on server
 * 2. Opens official Razorpay modal with order_id
 * 3. Verifies HMAC-SHA256 signature on /api/verify-payment
 */

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  receipt?: string;
  key_id?: string;
  isSandbox?: boolean;
  notice?: string;
}

export interface RazorpayVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message?: string;
  order_id?: string;
  payment_id?: string;
  error?: string;
}

export interface CheckoutOptions {
  amountInRupees: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: Record<string, string>;
  simulateSandbox?: boolean;
  onSuccess: (paymentResult: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => void;
  onFailure?: (errorMessage: string) => void;
  onDismiss?: () => void;
}

/**
 * Ensures checkout.js is loaded
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay checkout.js script from CDN');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * STEP 1: Calls backend /api/create-order to get order_id
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  currency: string = 'INR',
  receipt?: string,
  simulateSandbox?: boolean
): Promise<RazorpayOrderResponse> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(amountInPaise),
      currency,
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
      simulateSandbox: !!simulateSandbox,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.order_id) {
    throw new Error(data.error || 'Failed to create Razorpay order');
  }

  return data;
}

/**
 * STEP 3: Calls backend /api/verify-payment to verify signature
 */
export async function verifyRazorpayPayment(
  payload: RazorpayVerificationPayload
): Promise<RazorpayVerificationResponse> {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Payment signature verification failed');
  }

  return data;
}

/**
 * Generates valid HMAC test signature from backend
 */
export async function generateTestSignature(
  orderId: string,
  paymentId: string
): Promise<string> {
  const res = await fetch('/api/generate-test-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, payment_id: paymentId }),
  });
  const data = await res.json();
  if (!res.ok || !data.signature) {
    throw new Error(data.error || 'Failed to generate test signature');
  }
  return data.signature;
}

/**
 * Full Razorpay Standard Checkout Flow Orchestrator
 */
export async function initiateRazorpayStandardCheckout(
  options: CheckoutOptions
): Promise<void> {
  // 1. Calculate amount in paise (minimum 100 paise)
  const amountInPaise = Math.max(100, Math.round(options.amountInRupees * 100));

  // 2. Call backend to create Razorpay Order
  const orderData = await createRazorpayOrder(amountInPaise, 'INR', undefined, options.simulateSandbox);

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error('Razorpay SDK script could not be initialized. Use the interactive taste modal.');
  }

  // Key ID: prioritize server returned key_id, then VITE env, then test fallback
  const razorpayKey =
    orderData.key_id ||
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    'rzp_test_TiGoihNG0yHCUc';

  // 3. Configure Razorpay Standard Modal options
  const razorpayModalOptions = {
    key: razorpayKey,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'FarmDirect Organics',
    description: 'Cold-Chain Organic Harvest Escrow Lock',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=128&q=80',
    order_id: orderData.order_id,
    prefill: {
      name: options.customerName || 'Priya Sharma',
      email: options.customerEmail || 'priya.sharma@farmdirect.internal',
      contact: options.customerPhone || '+919820144892',
    },
    notes: {
      platform: 'FarmDirect Web App',
      escrowType: 'Doorstep Crispness Inspection Guarantee',
      ...(options.notes || {}),
    },
    theme: {
      color: '#006c49', // FarmDirect Forest Green
      backdrop_color: 'rgba(15, 23, 42, 0.85)',
    },
    handler: async function (response: any) {
      try {
        // Verify payment signature on backend
        const verification = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verification.success) {
          options.onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        } else {
          const errMsg = verification.message || 'Signature verification failed';
          options.onFailure?.(errMsg);
        }
      } catch (err: any) {
        options.onFailure?.(err.message || 'Error verifying Razorpay payment');
      }
    },
    modal: {
      ondismiss: function () {
        console.log('Razorpay payment modal closed by user');
        options.onDismiss?.();
      },
    },
  };

  const rzpInstance = new (window as any).Razorpay(razorpayModalOptions);

  rzpInstance.on('payment.failed', function (failureResponse: any) {
    console.error('Razorpay payment failed:', failureResponse.error);
    const failureMsg =
      failureResponse?.error?.description ||
      failureResponse?.error?.reason ||
      'Payment transaction was declined or failed.';
    options.onFailure?.(failureMsg);
  });

  rzpInstance.open();
}
