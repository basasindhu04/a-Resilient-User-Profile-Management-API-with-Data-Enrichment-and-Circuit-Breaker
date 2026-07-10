export const withRetry = async <T>(
    operation: () => Promise<T>,
    maxAttempts: number,
    baseDelayMs: number
): Promise<T> => {
    let attempt = 1;
    while (true) {
        try {
            return await operation();
        } catch (error: any) {
            if (attempt >= maxAttempts) {
                console.error(`Operation failed after ${maxAttempts} attempts:`, error.message);
                throw error;
            }
            
            // Re-throw if error is not transient (e.g., 400 Bad Request, 404 Not Found)
            // Assuming transient errors are 500, 503, network errors, timeouts
            if (error.response && error.response.status !== 500 && error.response.status !== 503) {
                 console.error(`Non-transient error encountered (${error.response.status}), aborting retries.`);
                 throw error;
            }

            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            console.warn(`Operation failed, attempt ${attempt}/${maxAttempts}. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            attempt++;
        }
    }
};
