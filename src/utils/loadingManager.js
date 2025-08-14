/**
 * Loading State Management Utility for CHIRAL Website
 * Provides consistent loading state management and UI components
 */

import { useState, useEffect, useCallback } from 'react'

// Loading types for different operations
export const LOADING_TYPES = {
  FORM_SUBMIT: 'form_submit',
  DATA_FETCH: 'data_fetch',
  FILE_UPLOAD: 'file_upload',
  API_REQUEST: 'api_request',
  NAVIGATION: 'navigation',
  SEARCH: 'search'
}

/**
 * Custom hook for managing loading states
 */
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [loadingType, setLoadingType] = useState(LOADING_TYPES.API_REQUEST)

  const startLoading = useCallback((message = '', type = LOADING_TYPES.API_REQUEST) => {
    setIsLoading(true)
    setLoadingMessage(message)
    setLoadingType(type)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage('')
  }, [])

  return {
    isLoading,
    loadingMessage,
    loadingType,
    startLoading,
    stopLoading,
    setIsLoading,
    setLoadingMessage,
    setLoadingType
  }
}

/**
 * Custom hook for managing multiple loading states
 */
export const useMultipleLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState({})

  const setLoading = useCallback((key, loading, message = '', type = LOADING_TYPES.API_REQUEST) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading ? { loading, message, type, timestamp: Date.now() } : null
    }))
  }, [])

  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]?.loading)
  }, [loadingStates])

  const getLoadingMessage = useCallback((key) => {
    return loadingStates[key]?.message || ''
  }, [loadingStates])

  const hasAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state?.loading)
  }, [loadingStates])

  return {
    loadingStates,
    setLoading,
    isLoading,
    getLoadingMessage,
    hasAnyLoading,
    clearAll: () => setLoadingStates({})
  }
}

/**
 * Enhanced async operation wrapper with loading state
 */
export const withLoadingState = (loadingHook, key = 'default') => {
  return async (asyncFn, loadingMessage = 'Loading...', loadingType = LOADING_TYPES.API_REQUEST) => {
    const { startLoading, stopLoading, setLoading } = loadingHook

    try {
      if (startLoading) {
        startLoading(loadingMessage, loadingType)
      } else if (setLoading) {
        setLoading(key, true, loadingMessage, loadingType)
      }

      const result = await asyncFn()
      return result
    } finally {
      if (stopLoading) {
        stopLoading()
      } else if (setLoading) {
        setLoading(key, false)
      }
    }
  }
}

/**
 * Progress tracking hook for long operations
 */
export const useProgressTracking = () => {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const updateProgress = useCallback((newProgress, newStage = '') => {
    setProgress(Math.min(Math.max(newProgress, 0), 100))
    if (newStage) setStage(newStage)
    setIsComplete(newProgress >= 100)
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(0)
    setStage('')
    setIsComplete(false)
  }, [])

  return {
    progress,
    stage,
    isComplete,
    updateProgress,
    resetProgress,
    setStage
  }
}

/**
 * Debounced loading state for search/filter operations
 */
export const useDebouncedLoading = (delay = 300) => {
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedLoading, setDebouncedLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLoading(isLoading)
    }, delay)

    return () => clearTimeout(timer)
  }, [isLoading, delay])

  return {
    isLoading,
    debouncedLoading,
    setIsLoading
  }
}

/**
 * Loading state messages by type and language
 */
export const LOADING_MESSAGES = {
  en: {
    [LOADING_TYPES.FORM_SUBMIT]: 'Submitting form...',
    [LOADING_TYPES.DATA_FETCH]: 'Loading data...',
    [LOADING_TYPES.FILE_UPLOAD]: 'Uploading file...',
    [LOADING_TYPES.API_REQUEST]: 'Processing request...',
    [LOADING_TYPES.NAVIGATION]: 'Loading page...',
    [LOADING_TYPES.SEARCH]: 'Searching...',
    DEFAULT: 'Loading...'
  },
  he: {
    [LOADING_TYPES.FORM_SUBMIT]: 'שולח טופס...',
    [LOADING_TYPES.DATA_FETCH]: 'טוען נתונים...',
    [LOADING_TYPES.FILE_UPLOAD]: 'מעלה קובץ...',
    [LOADING_TYPES.API_REQUEST]: 'מעבד בקשה...',
    [LOADING_TYPES.NAVIGATION]: 'טוען עמוד...',
    [LOADING_TYPES.SEARCH]: 'מחפש...',
    DEFAULT: 'טוען...'
  }
}

/**
 * Get localized loading message
 */
export const getLoadingMessage = (type, language = 'en', customMessage = '') => {
  if (customMessage) return customMessage
  
  const messages = LOADING_MESSAGES[language] || LOADING_MESSAGES.en
  return messages[type] || messages.DEFAULT
}

/**
 * Loading timeout hook - automatically stops loading after timeout
 */
export const useLoadingTimeout = (timeout = 30000) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setHasTimedOut(false)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
      setHasTimedOut(true)
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setHasTimedOut(false)
  }, [])

  return {
    isLoading,
    hasTimedOut,
    startLoading,
    stopLoading
  }
}

export default {
  useLoadingState,
  useMultipleLoadingStates,
  useProgressTracking,
  useDebouncedLoading,
  useLoadingTimeout,
  withLoadingState,
  getLoadingMessage,
  LOADING_TYPES,
  LOADING_MESSAGES
}