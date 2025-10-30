export interface PaymentData {
  orderId: string;
  sendAmount: string;
  beneficiaryAmount: string;
  cvv: string;
  paymentReviewUrl: string;
  successUrlPattern: string;
  homepageUrl: string;
}

export const createPaymentTestData = (orderId: string): PaymentData => ({
  orderId,
  sendAmount: '$60.00',
  beneficiaryAmount: '$1113.00',
  cvv: '123',
  paymentReviewUrl: `https://test.pay.felixpago.com/34ac41b2-e898-4073-98dc-f9811e04c0f2/payment/review?overseer=true`,
  successUrlPattern: `https://test.pay.felixpago.com/28c837fb-3f63-4893-8910-5134ed4c5ba2/payment/status?status=APPROVED&overseer=true`,
  homepageUrl: 'https://www.felixpago.com/'
});

// Default data for when order ID is not yet available
export const defaultPaymentTestData: PaymentData = {
  orderId: '',
  sendAmount: '$60.00',
  beneficiaryAmount: '$1113.00',
  cvv: '123',
  paymentReviewUrl: 'https://test.pay.felixpago.com/placeholder/payment/review?overseer=true',
  successUrlPattern: 'https://test.pay.felixpago.com/placeholder/payment/status?status=APPROVED&overseer=true',
  homepageUrl: 'https://www.felixpago.com/'
};

export interface SuccessMessages {
  successTitle: string;
  beneficiaryMessage: string;
}

export const successMessages: SuccessMessages = {
  successTitle: '¡Listo! Tu pago se completó con éxito.',
  beneficiaryMessage: '💸 Aldo Card Card recibirá 1101 USD por tu envío de $60 USD.'
};

export interface HomepageData {
  expectedTitle: string;
  expectedUrlPattern: RegExp;
}

export const homepageData: HomepageData = {
  expectedTitle: 'Envíos de dinero en segundos desde WhatsApp - Félix Pago',
  expectedUrlPattern: /https:\/\/www\.felixpago\.com\/?.*/
}; 