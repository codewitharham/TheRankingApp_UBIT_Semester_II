class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null; // It seems 'data' is intended to be used, but it's not initialized.
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            // Capture the stack trace if 'stack' is not provided.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };