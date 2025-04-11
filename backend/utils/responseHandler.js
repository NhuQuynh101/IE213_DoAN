/**
 * Utility to handle API responses consistently
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {Object} data - Response data (optional)
 * @returns {Object} - JSON response
 */
const response = (res, statusCode, message, data = null) => {
    const success = statusCode >= 200 && statusCode < 400;
    
    const responseObject = {
        success,
        message
    };
    
    if (data) {
        responseObject.data = data;
    }
    
    return res.status(statusCode).json(responseObject);
};

export default response; 