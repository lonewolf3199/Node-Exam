    class AppError extends Error{
        constructor(message, code){
            super(message);
            this.code = code;
            if (`${code}`.startsWith('4')) {
                this.code = 'fail';
        }else if(`${code}`.startsWith('2')){
            this.code = 'success'
        }else{
            this.code = 'Error';
        }
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError