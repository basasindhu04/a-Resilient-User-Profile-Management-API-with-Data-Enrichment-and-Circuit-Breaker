import axios from 'axios';
import CircuitBreaker from 'opossum';
import { withRetry } from '../utils/Retry';
import * as dotenv from 'dotenv';

dotenv.config();

export interface EnrichmentData {
    recentActivity: string[];
    loyaltyScore: number;
}

export class ExternalEnrichmentClient {
    private circuitBreaker: CircuitBreaker<[string], EnrichmentData>;
    private maxAttempts: number;
    private baseDelayMs: number;

    constructor() {
        const timeout = parseInt(process.env.EXTERNAL_SERVICE_TIMEOUT_MS || '1500', 10);
        const errorThresholdPercentage = 50; // Opossum uses % instead of raw counts, so if we want threshold=5, it depends on volume. We'll set options.
        const resetTimeout = parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS || '30000', 10);
        this.maxAttempts = parseInt(process.env.RETRY_MAX_ATTEMPTS || '3', 10);
        this.baseDelayMs = parseInt(process.env.RETRY_BASE_DELAY_MS || '100', 10);

        const options: CircuitBreaker.Options = {
            timeout, // Timeout for the action
            errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
            resetTimeout, // Time to wait before half-open
            volumeThreshold: parseInt(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || '5', 10), // Minimum requests before evaluating threshold
        };

        // We wrap the raw fetch call inside the circuit breaker.
        // Wait, the requirements say "A Retry mechanism with exponential backoff must be implemented... preceding the circuit breaker's open state."
        // This means the Circuit Breaker should wrap the Retrying action, or the Retrying action wraps the single call?
        // Usually: Client -> CircuitBreaker -> Retry -> HTTP Call.
        // If Retry is inside CB, the CB sees one success or failure after all retries are exhausted.
        this.circuitBreaker = new CircuitBreaker(this.fetchDataWithRetry.bind(this), options);

        this.circuitBreaker.on('open', () => console.warn('Circuit Breaker opened!'));
        this.circuitBreaker.on('halfOpen', () => console.warn('Circuit Breaker half-open!'));
        this.circuitBreaker.on('close', () => console.info('Circuit Breaker closed!'));
        this.circuitBreaker.fallback(() => this.fallbackResponse());
    }

    private async fetchDataWithRetry(userId: string): Promise<EnrichmentData> {
        return withRetry(
            () => this.fetchData(userId),
            this.maxAttempts,
            this.baseDelayMs
        );
    }

    private async fetchData(userId: string): Promise<EnrichmentData> {
        const url = process.env.EXTERNAL_SERVICE_URL || 'http://localhost:8081/enrich';
        const response = await axios.get(url, {
            params: { userId },
            timeout: parseInt(process.env.EXTERNAL_SERVICE_TIMEOUT_MS || '1500', 10)
        });
        return {
            recentActivity: response.data.recentActivity,
            loyaltyScore: response.data.loyaltyScore
        };
    }

    private fallbackResponse(): EnrichmentData {
        throw new Error('Enrichment service unavailable'); // We will catch this in the service to return 'unavailable' status
    }

    public async getEnrichmentData(userId: string): Promise<EnrichmentData> {
        try {
            return await this.circuitBreaker.fire(userId);
        } catch (error: any) {
             throw new Error('Enrichment service unavailable');
        }
    }
}
