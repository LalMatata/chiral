/**
 * Reusable Loading UI Components for CHIRAL Website
 * Consistent loading indicators and spinners
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Rocket, Zap, ShieldCheck } from 'lucide-react'

/**
 * Basic Spinner Component
 */
export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4', 
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    success: 'text-green-600',
    error: 'text-red-600'
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-label="Loading"
    />
  )
}

/**
 * Branded CHIRAL Loading Spinner
 */
export const ChiralSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-blue-200"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-4 border-blue-600 border-t-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Rocket className="h-1/2 w-1/2 text-blue-600" />
      </div>
    </div>
  )
}

/**
 * Pulsing Dots Loading Indicator
 */
export const PulsingDots = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
    success: 'bg-green-600'
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
}

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ 
  progress, 
  message = '', 
  showPercentage = true, 
  color = 'primary',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }

  return (
    <div className={`w-full ${className}`}>
      {message && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{message}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className={`h-2.5 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

/**
 * Card Loading Skeleton
 */
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-lg p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * List Loading Skeleton
 */
export const ListSkeleton = ({ items = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Page Loading Overlay
 */
export const PageLoadingOverlay = ({ 
  message = 'Loading...', 
  showSpinner = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
    >
      <div className="text-center space-y-4">
        {showSpinner && <ChiralSpinner size="lg" />}
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </motion.div>
  )
}

/**
 * Inline Loading Component
 */
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'sm', 
  showMessage = true,
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size={size} />
      {showMessage && (
        <span className="text-sm text-gray-600">{message}</span>
      )}
    </div>
  )
}

/**
 * Button Loading State
 */
export const LoadingButton = ({ 
  children, 
  loading = false, 
  loadingText = 'Loading...', 
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-50'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        (loading || disabled) ? 'cursor-not-allowed opacity-75' : 'hover:scale-[1.02]'
      }`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" color="white" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

/**
 * Section Loading Placeholder
 */
export const SectionLoading = ({ 
  title = 'Loading Section', 
  message = 'Please wait while we load the content...',
  icon: Icon = Zap,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="w-8 h-8 text-blue-600" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{message}</p>
    </div>
  )
}

/**
 * Table Loading Skeleton
 */
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`header-${index}`} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className="h-3 bg-gray-200 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default {
  Spinner,
  ChiralSpinner,
  PulsingDots,
  ProgressBar,
  CardSkeleton,
  ListSkeleton,
  PageLoadingOverlay,
  InlineLoading,
  LoadingButton,
  SectionLoading,
  TableSkeleton
}