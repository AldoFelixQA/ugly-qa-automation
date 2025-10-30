import { OverseerAuth } from './auth';
import { OverseerConfig, OrderResult } from './types';
import * as overseerService from '@felix/overseer-sdk-ts/dist/entities/overseer_service';
import { OrderGenerator } from './order-generator';
import * as grpcJs from '@grpc/grpc-js';
import { OrderDocument } from '@felix/overseer-sdk-ts/dist/entities/order_document';

export class SimpleOverseerClient {
   private client: any;
   private auth: OverseerAuth;
   private config: OverseerConfig;

   constructor( config : OverseerConfig) {
       this.config = config;
       this.auth = new OverseerAuth(config);
       this.client = new overseerService.OverseerServiceClient(
           this.config.overseerGrpc,
           grpcJs.credentials.createSsl()
       );
       console.log( '✅ gRPC client initialized successfully using nightveil logic' );
   }

   private async getAuthMetadata(): Promise<any> {
       const metadata = new grpcJs.Metadata();
       const token = await this.auth.getAuthenticationToken(this.config.overseerUrl);
       metadata.add("authorization", `Bearer ${token}`);
       return metadata;
   }

   // Se mantiene esta función como el único punto de entrada para iniciar una orden.
   async createAndStartOrder(orderData: any): Promise<OrderResult> {
       try {
           // Paso 1: Crear el documento localmente, tal como lo espera el servidor.
           const orderToProcess = OrderGenerator.createOrderDocument(orderData);
           console.log('✅ Order document created for startProcess:', JSON.stringify(orderToProcess, null, 2));

           const startProcessRequest: any = {
               order: orderToProcess,
               serviceAccount: this.config.serviceName,
           };
           
           // Paso 2: Llamar directamente a startProcess.
           const authMetadata = await this.getAuthMetadata();
           const startResponse = await new Promise<any>((resolve, reject) => {
               this.client.startProcess(
                   startProcessRequest,
                   authMetadata,
                   (err: any, response: any) => {
                       if (err) {
                           console.error('❌ Detailed startProcess error:', err);
                           return reject(new Error(`Failed to start process: ${err.message}`));
                       }
                       resolve(response);
                   },
               );
           });
           
           console.log(`✅ Process started successfully. Order ID: ${startResponse.orderId}, Workflow ID: ${startResponse.workflowId}`);
          
           // La respuesta de startProcess ya contiene todo lo que necesitamos.
           return {
               orderId: startResponse.orderId,
               workflowId: startResponse.workflowId,
               message: 'Order created and process started successfully',
           };
       } catch (error) {
           console.error('Error in createAndStartOrder:', error);
           throw error;
       }
   }
}

