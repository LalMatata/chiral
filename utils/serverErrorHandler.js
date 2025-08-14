/**
 * Server-side Error Handling Utility for CHIRAL Website
 * Provides consistent error handling, logging, and responses for Express.js
 */

// Error types for classification
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  RATE_LIMIT: 'rate_limit',
  AUTHENTICATION: 'authentication',
  NOT_FOUND: 'not_found',
  DATABASE: 'database',
  EMAIL: 'email',
  FILE_UPLOAD: 'file_upload',
  SERVER: 'server',
  UNKNOWN: 'unknown'
}

/**
 * Enhanced Error class with additional context
 */
export class ChiralServerError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, statusCode = 500, details = {}) {
    super(message)
    this.name = 'ChiralServerError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Logs errors with consistent format and context
 */
export const logServerError = (error, context = {}) => {
  const logData = {
    message: error.message,
    name: error.name,
    type: error.type || 'unknown',
    statusCode: error.statusCode || 500,
    timestamp: error.timestamp || new Date().toISOString(),
    stack: error.stack,
    context,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  }
  
  console.error('CHIRAL Server Error:', JSON.stringify(logData, null, 2))
  
  return logData
}

/**
 * Standardized error response sender
 */
export const sendErrorResponse = (res, error, context = {}) => {
  // Ensure error is properly formatted
  const processedError = error instanceof ChiralServerError 
    ? error 
    : new ChiralServerError(error.message || 'Internal server error', ERROR_TYPES.SERVER, 500)

  // Log the error
  logServerError(processedError, context)

  const statusCode = processedError.statusCode
  
  const response = {
    success: false,
    error: processedError.message,
    type: processedError.type,
    timestamp: processedError.timestamp
  }
  
  // Include additional details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = processedError.stack
    response.details = processedError.details
    response.context = context
  }
  
  res.status(statusCode).json(response)
}

/**
 * Validation middleware factory
 */
export const validateRequest = (validationRules) => {
  return (req, res, next) => {
    const errors = []
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field]
      
      // Required field check
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors.push(`${field} is required`)
        continue
      }
      
      // Skip other validations if field is not required and empty
      if (!rules.required && !value) continue
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`)
      }
      
      // Email validation
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.push(`${field} must be a valid email address`)
        }
      }
      
      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`)
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters long`)
      }
      
      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        errors.push(rules.customMessage || `${field} is invalid`)
      }
    }
    
    if (errors.length > 0) {
      return sendErrorResponse(res, new ChiralServerError(
        `Validation failed: ${errors.join(', ')}`,
        ERROR_TYPES.VALIDATION,
        400,
        { validationErrors: errors }
      ), { endpoint: req.path, method: req.method })
    }
    
    next()
  }
}

/**
 * Rate limiting error
 */
export const createRateLimitError = (message, retryAfter = 60) => {
  return new ChiralServerError(
    message || 'Rate limit exceeded',
    ERROR_TYPES.RATE_LIMIT,
    429,
    { retryAfter }
  )
}

/**
 * Database error handler
 */
export const handleDatabaseError = (error, operation = 'database operation') => {
  let message = `Database error during ${operation}`
  let details = { operation }
  
  // Handle specific database errors
  if (error.code === 'SQLITE_CONSTRAINT') {
    message = 'Data constraint violation'
    details.constraint = error.message
  } else if (error.code === 'SQLITE_BUSY') {
    message = 'Database is busy, please try again'
  } else if (error.code === 'SQLITE_READONLY') {
    message = 'Database is read-only'
  }
  
  return new ChiralServerError(
    message,
    ERROR_TYPES.DATABASE,
    500,
    details
  )
}

/**
 * Email error handler
 */
export const handleEmailError = (error, operation = 'email operation') => {
  let message = `Email error during ${operation}`
  let statusCode = 500
  
  // Handle specific email provider errors
  if (error.message && error.message.includes('API key')) {
    message = 'Email service configuration error'
  } else if (error.message && error.message.includes('rate limit')) {
    message = 'Email rate limit exceeded'
    statusCode = 429
  } else if (error.message && error.message.includes('invalid')) {
    message = 'Invalid email configuration'
    statusCode = 400
  }
  
  return new ChiralServerError(
    message,
    ERROR_TYPES.EMAIL,
    statusCode,
    { operation, originalError: error.message }
  )
}

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Handle specific error types
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendErrorResponse(res, new ChiralServerError(
      'Invalid JSON format in request body',
      ERROR_TYPES.VALIDATION,
      400
    ), { endpoint: req.path, method: req.method })
  }
  
  if (err.type === 'entity.too.large') {
    return sendErrorResponse(res, new ChiralServerError(
      'Request payload too large',
      ERROR_TYPES.VALIDATION,
      413
    ), { endpoint: req.path, method: req.method })
  }
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendErrorResponse(res, new ChiralServerError(
      'File too large',
      ERROR_TYPES.FILE_UPLOAD,
      413
    ), { endpoint: req.path, method: req.method })
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendErrorResponse(res, new ChiralServerError(
      'Unexpected file field',
      ERROR_TYPES.FILE_UPLOAD,
      400
    ), { endpoint: req.path, method: req.method })
  }
  
  // Default server error
  sendErrorResponse(res, err, { 
    endpoint: req.path, 
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })
}

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  sendErrorResponse(res, new ChiralServerError(
    `Route ${req.method} ${req.path} not found`,
    ERROR_TYPES.NOT_FOUND,
    404
  ), { endpoint: req.path, method: req.method })
}

export default {
  ChiralServerError,
  ERROR_TYPES,
  logServerError,
  sendErrorResponse,
  validateRequest,
  createRateLimitError,
  handleDatabaseError,
  handleEmailError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler
}