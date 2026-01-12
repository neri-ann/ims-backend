/**
 * JWKS Token Verifier for ims-backend
 * 
 * Verifies RS256 JWT access tokens using ms-auth JWKS endpoint.
 * This replaces the old shared-secret JWT verification.
 * 
 * @module lib/jwks-verifier
 */

import { logger } from '../config/logger';

// Environment configuration
const MS_AUTH_JWKS_URL = process.env.MS_AUTH_JWKS_URL || 'http://localhost:4002/auth/.well-known/jwks.json';
const JWT_EXPECTED_ISS = process.env.JWT_EXPECTED_ISS || 'agila-auth';
const JWT_EXPECTED_AUD = process.env.JWT_EXPECTED_AUD || 'agila-apis';

// Jose library - loaded dynamically to handle ESM/CJS issues
let joseModule: any = null;

/**
 * Extended JWT Payload interface with ms-auth specific claims
 */
export interface MsAuthJWTPayload {
    sub: string;              // User ID
    employeeNumber?: string;
    employeeId?: string;
    role?: string;            // User role (singular string, e.g., 'USER', 'ADMIN')
    departmentIds?: string[];
    departmentName?: string[];  // Department names (array)
    positionName?: string[];    // Position names (array)
    jti?: string;             // JWT ID
    iat?: number;
    exp?: number;
}

// Lazy initialization of JWKS client
let jwksClient: any = null;

/**
 * Load jose module lazily
 */
async function loadJose() {
    if (!joseModule) {
        try {
            joseModule = await import('jose');
        } catch (error) {
            logger.error('Failed to load jose module:', error);
            throw new Error('JWT verification not available');
        }
    }
    return joseModule;
}

/**
 * Get or create the JWKS client (singleton pattern)
 */
async function getJwksClient() {
    if (!jwksClient) {
        const jose = await loadJose();
        logger.info(`🔐 Initializing JWKS client with URL: ${MS_AUTH_JWKS_URL}`);
        jwksClient = jose.createRemoteJWKSet(new URL(MS_AUTH_JWKS_URL));
    }
    return jwksClient;
}

/**
 * Verify an RS256 access token against ms-auth JWKS.
 * 
 * @param accessToken - The JWT access token to verify
 * @returns Decoded JWT payload with user claims
 * @throws Error if token is missing, invalid, or expired
 */
export async function verifyAccessToken(accessToken: string): Promise<MsAuthJWTPayload> {
    if (!accessToken) {
        throw new Error('Missing access token');
    }

    try {
        const jose = await loadJose();
        const jwks = await getJwksClient();

        const { payload } = await jose.jwtVerify(accessToken, jwks, {
            issuer: JWT_EXPECTED_ISS,
            audience: JWT_EXPECTED_AUD,
            clockTolerance: 30, // 30 seconds leeway for clock skew
        });

        return payload as MsAuthJWTPayload;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Token verification failed: ${errorMessage}`);
        throw new Error(`Invalid or expired access token: ${errorMessage}`);
    }
}

/**
 * Check if JWKS verification is properly configured
 */
export function isJwksConfigured(): boolean {
    return !!MS_AUTH_JWKS_URL && MS_AUTH_JWKS_URL !== 'http://localhost:4002/auth/.well-known/jwks.json'
        || process.env.NODE_ENV === 'development';
}

// Log configuration on module load (safe - no jose import here)
logger.info('🔑 JWKS Token Verifier Configuration:');
logger.info(`   JWKS URL: ${MS_AUTH_JWKS_URL}`);
logger.info(`   Expected Issuer: ${JWT_EXPECTED_ISS}`);
logger.info(`   Expected Audience: ${JWT_EXPECTED_AUD}`);
