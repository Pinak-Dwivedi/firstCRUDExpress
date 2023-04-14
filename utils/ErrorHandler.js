class ErrorHandler extends Error
{
    constructor(message, statusCode)
    {
        super(message);
        this.statusCode = statusCode;
    }
}

exports.ErrorHandler = ErrorHandler;