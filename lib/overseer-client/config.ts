import { OverseerConfig } from './types';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

// Configuration for the Overseer client
export const overseerConfig: OverseerConfig = {
  projectId: 'felix-technologies',
  serviceName: 'nightveil',
  overseerUrl: 'https://overseer-sandbox-tl5k5elgjq-uc.a.run.app',
  overseerGrpc: 'overseer-sandbox-tl5k5elgjq-uc.a.run.app:443',
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../overseer-sandbox.json'),
};

// Function to get service account key path
export function ensureServiceAccountKey(): string {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, '../../overseer-sandbox.json');
  
  // Check if key file exists
  if (fs.existsSync(keyPath)) {
    console.log('✅ Service account key file found');
    return keyPath;
  } else {
    throw new Error(`Service account key file not found at: ${keyPath}`);
  }
}

// Validate configuration
export function validateConfig(): void {
  // Ensure we have a valid service account key
  const keyPath = ensureServiceAccountKey();
  
  // Set the environment variable
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

  if (!overseerConfig.projectId) {
    throw new Error('Project ID is not configured');
  }

  if (!overseerConfig.overseerUrl) {
    throw new Error('Overseer URL is not configured');
  }

  if (!overseerConfig.overseerGrpc) {
    throw new Error('Overseer gRPC endpoint is not configured');
  }

  console.log('Overseer configuration validated successfully');
  console.log('Project ID:', overseerConfig.projectId);
  console.log('Service Name:', overseerConfig.serviceName);
  console.log('Overseer URL:', overseerConfig.overseerUrl);
  console.log('Overseer gRPC:', overseerConfig.overseerGrpc);
  console.log('Service Account Path:', overseerConfig.serviceAccountPath);
}
