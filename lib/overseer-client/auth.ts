import { GoogleAuth } from "google-auth-library";
import { decode, type JwtPayload } from "jsonwebtoken";
import { OverseerConfig, TokenCache } from "./types";

export class OverseerAuth {
  private auth: GoogleAuth;
  private tokenCache: TokenCache = {};
  private config: OverseerConfig;

  constructor(config: OverseerConfig) {
    this.config = config;
    this.auth = new GoogleAuth({ 
      projectId: config.projectId,
      keyFile: config.serviceAccountPath
    });
  }

  async getAuthenticationToken(targetUrl: string): Promise<string> {
    const tokenKey = this.getTokenKey(targetUrl);
    const cachedToken = this.getCachedToken(tokenKey);
    
    if (cachedToken && !this.isTokenExpired(cachedToken)) {
      return cachedToken.token;
    }

    return this.generateNewToken(targetUrl, tokenKey);
  }

  private getTokenKey(targetUrl: string): string {
    return `${this.config.serviceName}_${targetUrl}`;
  }

  private getCachedToken(tokenKey: string): { token: string; expiresAt: number } | undefined {
    return this.tokenCache[tokenKey];
  }

  private isTokenExpired(cachedToken: { token: string; expiresAt: number }): boolean {
    return Date.now() >= cachedToken.expiresAt;
  }

  private async generateNewToken(targetUrl: string, tokenKey: string): Promise<string> {
    try {
      console.log(`Generating new token for ${this.config.serviceName} with audience ${targetUrl}`);
      
      // Use the service account from the JSON file with specific audience
      const client = await this.auth.getIdTokenClient(targetUrl);
      const token = await client.idTokenProvider.fetchIdToken(targetUrl);
      
      if (!token) {
        throw new Error('Failed to get ID token from service account');
      }
      
      console.log(`ID Token obtained successfully using service account: ${this.config.serviceAccountPath}`);

      // Cache the token for 1 hour
      this.tokenCache[tokenKey] = {
        token,
        expiresAt: Date.now() + (3600 * 1000)
      };

      return token;
    } catch (error) {
      console.error('Error generating authentication token:', error);
      throw new Error(`Failed to generate authentication token: ${error}`);
    }
  }

  private calculateTokenTimeToExpiry(token: string): number {
    try {
      const tokenClaims: string | JwtPayload | null = decode(token);
      
      if (!tokenClaims || typeof tokenClaims === "string") {
        throw new Error(`Invalid token claims type: ${typeof tokenClaims}`);
      }

      const expirationTime = tokenClaims.exp;
      if (!expirationTime) return 3600; // Default to 1 hour

      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = Math.floor(expirationTime - currentTime);
      
      // Return remaining time with 5 minute buffer
      return Math.max(300, remainingTime);
    } catch (error) {
      console.error('Error calculating token expiry:', error);
      return 3600; // Default to 1 hour
    }
  }

  private generateTokenId(token: string): string {
    // Simple hash for token identification
    return Buffer.from(token).toString('base64').substring(0, 8);
  }
}
