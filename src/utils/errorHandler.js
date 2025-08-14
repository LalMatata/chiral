/**
 * Standardized Error Handling Utility for CHIRAL Website
 * Provides consistent error handling, logging, and user-friendly messages
 */

// Error types for classification
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network', 
  SERVER: 'server',
  RATE_LIMIT: 'rate_limit',
  AUTHENTICATION: 'authentication',
  NOT_FOUND: 'not_found',
  UNKNOWN: 'unknown'
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  en: {
    [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
    [ERROR_TYPES.NETWORK]: 'Connection error. Please check your internet connection and try again.',
    [ERROR_TYPES.SERVER]: 'Server error. Please try again later or contact support.',
    [ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
    [ERROR_TYPES.AUTHENTICATION]: 'Authentication required. Please log in and try again.',
    [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    DEFAULT: 'Something went wrong. Please try again.'
  },
  he: {
    [ERROR_TYPES.VALIDATION]: 'אנא בדוק את הקלט שלך ונסה שוב.',
    [ERROR_TYPES.NETWORK]: 'שגיאת חיבור. אנא בדוק את חיבור האינטרנט ונסה שוב.',
    [ERROR_TYPES.SERVER]: 'שגיאת שרת. אנא נסה שוב מאוחר יותר או צור קשר עם התמיכה.',
    [ERROR_TYPES.RATE_LIMIT]: 'יותר מדי בקשות. אנא המתן רגע ונסה שוב.',
    [ERROR_TYPES.AUTHENTICATION]: 'נדרש אימות. אנא התחבר ונסה שוב.',
    [ERROR_TYPES.NOT_FOUND]: 'המשאב המבוקש לא נמצא.',
    [ERROR_TYPES.UNKNOWN]: 'אירעה שגיאה לא צפויה. אנא נסה שוב.',
    DEFAULT: 'משהו השתבש. אנא נסה שוב.'
  }
}

/**
 * Enhanced Error class with additional context
 */
export class ChiralError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, statusCode = 500, details = {}) {
    super(message)
    this.name = 'ChiralError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Classifies HTTP response errors into error types
 */
export const classifyError = (error, response) => {
  if (response) {
    switch (response.status) {
      case 400:
        return ERROR_TYPES.VALIDATION
      case 401:
      case 403:
        return ERROR_TYPES.AUTHENTICATION
      case 404:
        return ERROR_TYPES.NOT_FOUND
      case 429:
        return ERROR_TYPES.RATE_LIMIT
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_TYPES.SERVER
      default:
        if (response.status >= 500) return ERROR_TYPES.SERVER
        if (response.status >= 400) return ERROR_TYPES.VALIDATION
        return ERROR_TYPES.UNKNOWN
    }
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_TYPES.NETWORK
  }
  
  if (error.message && error.message.toLowerCase().includes('network')) {
    return ERROR_TYPES.NETWORK
  }
  
  return ERROR_TYPES.UNKNOWN
}

/**
 * Gets user-friendly error message based on type and language
 */
export const getUserFriendlyMessage = (errorType, language = 'en', fallbackMessage) => {
  const messages = ERROR_MESSAGES[language] || ERROR_MESSAGES.en
  return messages[errorType] || fallbackMessage || messages.DEFAULT
}

/**
 * Processes and normalizes API errors
 */
export const processApiError = async (response, customMessage) => {
  let errorData = {}
  let errorMessage = customMessage || 'Request failed'
  
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } else {
      errorMessage = response.statusText || errorMessage
    }
  } catch {
    // If parsing fails, use status text or fallback message
    errorMessage = response.statusText || errorMessage
  }
  
  const errorType = classifyError(null, response)
  
  return new ChiralError(
    errorMessage,
    errorType,
    response.status,
    {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      data: errorData
    }
  )
}

/**
 * Enhanced fetch wrapper with standardized error handling
 */
export const apiRequest = async (url, options = {}) => {
  // Use environment variable for API URL, fallback to localhost for development
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    ...options
  }
  
  try {
    const response = await fetch(fullURL, defaultOptions)
    
    if (!response.ok) {
      throw await processApiError(response)
    }
    
    // Try to parse JSON, fallback to text
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text()
    }
    
  } catch (error) {
    // If it's already a ChiralError, re-throw
    if (error instanceof ChiralError) {
      throw error
    }
    
    // Handle network/fetch errors
    const errorType = classifyError(error)
    throw new ChiralError(
      error.message || 'Request failed',
      errorType,
      0,
      { originalError: error }
    )
  }
}

/**
 * Logs errors with consistent format and context
 */
export const logError = (error, context = {}) => {
  const logData = {
    message: error.message,
    name: error.name,
    type: error.type || 'unknown',
    statusCode: error.statusCode || 0,
    timestamp: error.timestamp || new Date().toISOString(),
    stack: error.stack,
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  }
  
  console.error('CHIRAL Error:', logData)
  
  // In production, send to error tracking service
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    // Send to error tracking service like Sentry, LogRocket, etc.
    try {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          custom_map: { custom_error_type: error.type }
        })
      }
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError)
    }
  }
  
  return logData
}

/**
 * React hook for consistent error handling
 */
export const useErrorHandler = (language = 'en') => {
  const handleError = (error, context = {}) => {
    const processedError = error instanceof ChiralError 
      ? error 
      : new ChiralError(error.message || 'Unknown error', ERROR_TYPES.UNKNOWN)
    
    logError(processedError, context)
    
    const userMessage = getUserFriendlyMessage(
      processedError.type, 
      language, 
      processedError.message
    )
    
    return {
      error: processedError,
      userMessage,
      shouldRetry: processedError.type === ERROR_TYPES.NETWORK || processedError.type === ERROR_TYPES.SERVER,
      isTemporary: [ERROR_TYPES.NETWORK, ERROR_TYPES.SERVER, ERROR_TYPES.RATE_LIMIT].includes(processedError.type)
    }
  }
  
  return { handleError }
}

/**
 * Server-side error response helper
 */
export const sendErrorResponse = (res, error, context = {}) => {
  const statusCode = error.statusCode || 500
  const errorType = error.type || ERROR_TYPES.SERVER
  
  logError(error, { ...context, isServerSide: true })
  
  const response = {
    success: false,
    error: error.message || 'Internal server error',
    type: errorType,
    timestamp: new Date().toISOString()
  }
  
  // Only include stack trace in development
  if (import.meta.env.DEV) {
    response.stack = error.stack
    response.details = error.details
  }
  
  res.status(statusCode).json(response)
}

/**
 * Validation error helper
 */
export const createValidationError = (field, message, value) => {
  return new ChiralError(
    `Validation failed for ${field}: ${message}`,
    ERROR_TYPES.VALIDATION,
    400,
    { field, value, validationMessage: message }
  )
}

/**
 * Rate limiting error helper
 */
export const createRateLimitError = (retryAfter = 60) => {
  return new ChiralError(
    'Rate limit exceeded. Please try again later.',
    ERROR_TYPES.RATE_LIMIT,
    429,
    { retryAfter }
  )
}

export default {
  ChiralError,
  ERROR_TYPES,
  ERROR_MESSAGES,
  classifyError,
  getUserFriendlyMessage,
  processApiError,
  apiRequest,
  logError,
  useErrorHandler,
  sendErrorResponse,
  createValidationError,
  createRateLimitError
}