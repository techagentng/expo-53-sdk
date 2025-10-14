import { Alert, Platform } from 'react-native';

// Set to track if we've shown an error to prevent duplicate alerts
let hasShownError = false;

/**
 * Handles unhandled promise rejections
 */
const setupPromiseRejectionHandler = () => {
  const ErrorUtils = (global as any).ErrorUtils;
  if (!ErrorUtils) return;
  
  const defaultHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    if (__DEV__) {
      console.error('Unhandled Error:', {
        error,
        isFatal,
        platform: Platform.OS,
        timestamp: new Date().toISOString()
      });
    }

    // Show error alert in development
    if (__DEV__ && !hasShownError) {
      hasShownError = true;
      Alert.alert(
        'Unhandled Error',
        `Error: ${error?.name || 'Unknown error'}\n\n` +
        `Message: ${error?.message || 'No message'}\n\n` +
        `This error was caught by the global error handler.`,
        [
          {
            text: 'OK',
            onPress: () => {
              hasShownError = false;
            },
          },
        ]
      );
    }

    // Call the default handler
    if (typeof defaultHandler === 'function') {
      defaultHandler(error, isFatal);
    }
  });
};

/**
 * Handles unhandled promise rejections
 */
const setupUnhandledRejectionHandler = () => {
  const PromiseRejectionTracker = (global as any).PromiseRejectionTracker;
  if (!PromiseRejectionTracker) return;
  
  const originalHandler = PromiseRejectionTracker.setUnhandledPromiseRejectionHandler;
  
  PromiseRejectionTracker.setUnhandledPromiseRejectionHandler = (id: number, error: Error) => {
    if (__DEV__) {
      console.error('Unhandled Promise Rejection:', {
        id,
        error,
        platform: Platform.OS,
        timestamp: new Date().toISOString()
      });
    }

    // Show error alert in development
    if (__DEV__ && !hasShownError) {
      hasShownError = true;
      Alert.alert(
        'Unhandled Promise Rejection',
        `Error: ${error?.name || 'Unknown error'}\n\n` +
        `Message: ${error?.message || 'No message'}\n\n` +
        'This error was caught by the global promise rejection handler.',
        [
          {
            text: 'OK',
            onPress: () => {
              hasShownError = false;
            },
          },
        ]
      );
    }

    // Call the original handler
    if (typeof originalHandler === 'function') {
      originalHandler(id, error);
    }
  };
};

/**
 * Sets up global error handlers for the application
 */
const setupGlobalErrorHandlers = () => {
  if ((global as any).ErrorUtils) {
    setupPromiseRejectionHandler();
  }
  
  if ((global as any).PromiseRejectionTracker) {
    setupUnhandledRejectionHandler();
  }
};

export default setupGlobalErrorHandlers;
