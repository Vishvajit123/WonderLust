class ExpressError extends Error{
    constructor(srarusCode, message){
        super();
        this.statusCode = this.statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;