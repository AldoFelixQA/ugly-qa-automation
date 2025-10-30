import {
    OrderDocument,
    OrderInformation,
   } from '@felix/overseer-sdk-ts/dist/entities/order_document';
   import { Timestamp } from '@felix/overseer-sdk-ts/dist/entities/google/protobuf/timestamp';
   import { OrderCreationData, COUNTRIES, CURRENCIES, ORDER_TYPES, CREATION_SOURCES, DELIVERY_METHOD_TYPES } from './types';
   import { BaseCustomer } from '@felix/overseer-sdk-ts/dist/entities/customer';
   import { BaseBeneficiary } from '@felix/overseer-sdk-ts/dist/entities/beneficiary';
   import { BaseDeliveryMethod } from '@felix/overseer-sdk-ts/dist/entities/delivery_method';
   import { FxRate } from '@felix/overseer-sdk-ts/dist/entities/fx_rate';
   
   export class OrderGenerator {
   
      static createOrderDocument(data: OrderCreationData): Partial<OrderDocument> {
          const now = this.createTimestamp();
         
          return OrderDocument.fromPartial({
              orderType: ORDER_TYPES.REMITTANCE,
              conversationId: data.conversationId,
              baseCustomer: this.createBaseCustomer(data, now),
              baseBeneficiary: this.createBaseBeneficiary(data, now),
              orderInformation: this.createOrderInformation(data, now),
              baseDeliveryMethod: this.createBaseDeliveryMethod(data, now),
              creationSource: CREATION_SOURCES.CHAT,
              fxRate: this.createFxRate(data, now),
              promotionId: data.promotionId,
              fees: [], 
              promotions: [],
          });
      }
   
      private static createBaseCustomer(data: OrderCreationData, now: Timestamp): BaseCustomer {
          return BaseCustomer.fromPartial({
              userId: data.userId,
              phoneNumber: data.phoneNumber,
              phoneCountryCode: data.phoneCountryCode,
              originCountry: COUNTRIES.MEXICO, 
              createdAt: now,
              lastModifiedDate: now,
          });
      }
   
      private static createBaseBeneficiary(data: OrderCreationData, now: Timestamp): BaseBeneficiary {
          return BaseBeneficiary.fromPartial({
              beneficiaryId: data.beneficiaryId,
              beneficiaryCountry: COUNTRIES.MEXICO, 
              createdAt: now,
              lastModifiedDate: now,
          });
      }
   
      private static createOrderInformation(data: OrderCreationData, now: Timestamp): OrderInformation {
          return OrderInformation.fromPartial({
              originAmount: data.originAmount,
              originCurrency: CURRENCIES.USD,
              originCountry: COUNTRIES.UNITED_STATES, 
              destinationCountry: COUNTRIES.MEXICO,  
              destinationCurrency: CURRENCIES.MXN,  
              destinationAmount: data.destinationAmount,
              finalAmount: data.finalAmount,
              nonPromotionalFee: 0,
              createdAt: now,
              lastModifiedDate: now,
          });
      }
   
      private static createBaseDeliveryMethod(data: OrderCreationData, now: Timestamp): BaseDeliveryMethod {
      
        return BaseDeliveryMethod.fromPartial({
            id: data.deliveryMethodId, 
            deliveryMethodType: DELIVERY_METHOD_TYPES.BANK,
            createdAt: now,
            lastModifiedDate: now,
        });
        
    }
      
      private static createFxRate(data: OrderCreationData, now: Timestamp): FxRate {

          return FxRate.fromPartial({
              felixRate: data.fxRate,
              orderRate: data.fxRate,
              originCurrency: CURRENCIES.USD,
              destinationCurrency: CURRENCIES.MXN,
              createdAt: now,
              lastModifiedDate: now,
          });
      }
   
      private static createTimestamp(): Timestamp {
          const now = new Date();
          return Timestamp.fromPartial({
              seconds: Math.floor(now.getTime() / 1000).toString(),
              nanos: (now.getTime() % 1000) * 1000000,
          });
      }
   }
