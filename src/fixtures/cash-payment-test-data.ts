export interface CashPaymentData {
  orderId: string;
  sendAmount: string;
  beneficiaryAmount: string;
  paymentReviewUrl: string;
  barcodeUrl: string;
  storeSelectionUrl: string;
  paymentMethodsUrl: string;
}

export const createCashPaymentTestData = (orderId: string): CashPaymentData => ({
  orderId,
  sendAmount: '$60.00',
  beneficiaryAmount: '$450.00',
  paymentReviewUrl: `https://test.pay.felixpago.com/${orderId}/payment/review?overseer=true`,
  barcodeUrl: `https://test.pay.felixpago.com/${orderId}/payment/barcode?overseer=true`,
  storeSelectionUrl: `https://test.pay.felixpago.com/${orderId}/new-cash/3?only_user_info=false&overseer=true`,
  paymentMethodsUrl: `https://test.pay.felixpago.com/${orderId}/payment/change-payment-method?overseer=true`
});

// Default data for when order ID is not yet available
export const defaultCashPaymentTestData: CashPaymentData = {
  orderId: 'fe2cb863-128d-4066-8855-f02b1b9001e5',
  sendAmount: '$60.00',
  beneficiaryAmount: '$450.00',
  paymentReviewUrl: 'https://test.pay.felixpago.com/fe2cb863-128d-4066-8855-f02b1b9001e5/payment/review?overseer=true',
  barcodeUrl: 'https://test.pay.felixpago.com/fe2cb863-128d-4066-8855-f02b1b9001e5/payment/barcode?overseer=true',
  storeSelectionUrl: 'https://test.pay.felixpago.com/fe2cb863-128d-4066-8855-f02b1b9001e5/new-cash/3?only_user_info=false&overseer=true',
  paymentMethodsUrl: 'https://test.pay.felixpago.com/fe2cb863-128d-4066-8855-f02b1b9001e5/payment/change-payment-method?overseer=true'
};

export interface CashPaymentValidations {
  headerText: string;
  finalLegend: string;
  codeLength: number;
  walgreensLogo: boolean;
}

export const cashPaymentValidations: CashPaymentValidations = {
  headerText: 'Enseña este código',
  finalLegend: 'Toma una captura para tener el código a la mano. Recuerda que siempre puedes crear uno nuevo.',
  codeLength: 30,
  walgreensLogo: true
};
