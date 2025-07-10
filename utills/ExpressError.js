class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);  // Also pass the message to the base Error class
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;
