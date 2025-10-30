import { Metadata } from '@grpc/grpc-js';
import path from 'path';
import { OverseerAuth } from './auth';
import { OverseerConfig, OrderResult } from './types';

// Import the compiled SDK for message types
const orderDocumentPb = require('@felix/overseer-sdk-ts/dist/entities/order_document_pb');

// Create a basic gRPC client using @grpc/grpc-js
const { Client } = require('@grpc/grpc-js');

// Create a custom service client that implements the Overseer service methods
class OverseerServiceClient {
  private client: any;

  constructor(address: string, credentials: any) {
    this.client = new (require('@grpc/grpc-js').Client)(address, credentials);
  }

  saveOrder(request: any, metadata: any, callback: any) {
    // Use the basic client to make a unary call
    this.client.makeUnaryRequest(
      '/overseer.OverseerService/SaveOrder',
      (arg: any) => Buffer.from(JSON.stringify(arg)),
      (buffer: Buffer) => JSON.parse(buffer.toString()),
      request,
      metadata,
      callback
    );
  }

  startProcess(request: any, metadata: any, callback: any) {
    this.client.makeUnaryRequest(
      '/overseer.OverseerService/StartProcess',
      (arg: any) => Buffer.from(JSON.stringify(arg)),
      (buffer: Buffer) => JSON.parse(buffer.toString()),
      request,
      metadata,
      callback
    );
  }

  getOrder(request: any, metadata: any, callback: any) {
    this.client.makeUnaryRequest(
      '/overseer.OverseerService/GetOrder',
      (arg: any) => Buffer.from(JSON.stringify(arg)),
      (buffer: Buffer) => JSON.parse(buffer.toString()),
      request,
      metadata,
      callback
    );
  }
}

export class OverseerClient {
  private client!: OverseerServiceClient;
  private auth: OverseerAuth;
  private config: OverseerConfig;

  constructor(config: OverseerConfig) {
    this.config = config;
    this.auth = new OverseerAuth(config);
    
    // Create gRPC client with SSL credentials
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Import credentials from @grpc/grpc-js directly
      const { credentials } = require('@grpc/grpc-js');
      // Create the custom service client
      this.client = new OverseerServiceClient(
        this.config.overseerGrpc,
        credentials.createSsl()
      );
    } catch (error) {
      console.error('Error initializing gRPC client:', error);
      throw error;
    }
  }

  async saveOrder(orderDocument: any): Promise<any> {
    const authMetadata = await this.getAuthMetadata();
    
    return new Promise((resolve, reject) => {
      const request = {
        order: orderDocument,
        serviceAccount: this.config.serviceName, // Required field
      };

      this.client.saveOrder(request, authMetadata, (err: any, response: any) => {
        if (err) {
          console.error(`saveOrder error for order ${orderDocument.id}:`, err);
          reject(new Error(`Failed to save order: ${err.message}`));
          return;
        }
        resolve(response);
      });
    });
  }

  async startProcess(orderDocument: any): Promise<any> {
    const authMetadata = await this.getAuthMetadata();
    
    return new Promise((resolve, reject) => {
      const request = {
        order: orderDocument,
        serviceAccount: this.config.serviceName, // Required field
      };

      this.client.startProcess(request, authMetadata, (err: any, response: any) => {
        if (err) {
          console.error(`startProcess error for order ${orderDocument.id}:`, err);
          reject(new Error(`Failed to start process: ${err.message}`));
          return;
        }
        resolve(response);
      });
    });
  }

  async getOrder(orderId: string): Promise<any> {
    const authMetadata = await this.getAuthMetadata();
    
    return new Promise((resolve, reject) => {
      const request = {
        orderId: orderId,
      };

      this.client.getOrder(request, authMetadata, (err: any, response: any) => {
        if (err) {
          console.error(`getOrder error for order ${orderId}:`, err);
          reject(new Error(`Order ${orderId} not found`));
          return;
        }
        
        if (!response.order) {
          reject(new Error(`Order ${orderId} not found`));
          return;
        }
        
        resolve(response.order);
      });
    });
  }

  private async getAuthMetadata(): Promise<Metadata> {
    const token = await this.auth.getAuthenticationToken(this.config.overseerUrl);
    const metadata = new Metadata();
    metadata.add('authorization', `Bearer ${token}`);
    return metadata;
  }

  async createAndStartOrder(orderData: any): Promise<OrderResult> {
    try {
      // Create order document
      const orderDocument = this.createOrderDocument(orderData);
      
      // Save order
      const saveResponse = await this.saveOrder(orderDocument);
      console.log(`✅ Order saved successfully: ${saveResponse.orderId}`);
      
      // Start process
      const startResponse = await this.startProcess(orderDocument);
      console.log(`✅ Process started successfully: ${startResponse.workflowId}`);
      
      // Get order details
      const order = await this.getOrder(orderDocument.id);
      
      return {
        orderId: order.id,
        workflowId: startResponse.workflowId,
        message: 'Order created and process started successfully',
        paymentReviewUrl: order.paymentReviewUrl
      };
    } catch (error) {
      console.error('Error in createAndStartOrder:', error);
      throw error;
    }
  }

  private createOrderDocument(orderData: any): any {
    // Import the order generator
    const { OrderGenerator } = require('./order-generator');
    return OrderGenerator.createOrderDocument(orderData);
  }
}

// Export all classes and types for easy access
export { OverseerAuth } from './auth';
export { OrderGenerator } from './order-generator';
export { overseerConfig, validateConfig } from './config';
export * from './types';

