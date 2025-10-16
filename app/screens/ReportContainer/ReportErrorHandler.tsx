import React from 'react';
import { View, Text } from 'react-native';
import TextButton from '../../components/TextButton';
import LoadingImage from '../../components/loadingStates/LoadingImage';
import ErrorImage from '../../components/loadingStates/ErrorImage';
import NetworkError from '../../components/loadingStates/NetworkError';
import { COLORS, SIZES } from '@/constants';

export interface ErrorState {
  type: 'network' | 'server' | 'unknown';
  message: string;
  retryable?: boolean;
}

interface ReportErrorHandlerProps {
  error: ErrorState | null;
  loading: boolean;
  onRetry?: () => void;
  onGoBack: () => void;
}

const ReportErrorHandler: React.FC<ReportErrorHandlerProps> = ({
  error,
  loading,
  onRetry,
  onGoBack,
}) => {
  if (loading) {
    return <LoadingImage />;
  }

  if (!error) {
    return null;
  }

  const renderErrorContent = () => {
    switch (error.type) {
      case 'network':
        return (
          <View style={styles.errorContainer}>
            <NetworkError />
            <Text style={styles.errorText}>{error.message}</Text>
            {error.retryable && onRetry && (
              <TextButton
                label="Retry"
                buttonContainerStyle={styles.retryButton}
                labelStyle={styles.retryButtonText}
                onPress={onRetry}
              />
            )}
            <TextButton
              label="Go Back"
              buttonContainerStyle={styles.backButton}
              labelStyle={styles.backButtonText}
              onPress={onGoBack}
            />
          </View>
        );

      case 'server':
        return (
          <View style={styles.errorContainer}>
            <ErrorImage />
            <Text style={styles.errorText}>{error.message}</Text>
            {error.retryable && onRetry && (
              <TextButton
                label="Retry"
                buttonContainerStyle={styles.retryButton}
                labelStyle={styles.retryButtonText}
                onPress={onRetry}
              />
            )}
            <TextButton
              label="Go Back"
              buttonContainerStyle={styles.backButton}
              labelStyle={styles.backButtonText}
              onPress={onGoBack}
            />
          </View>
        );

      default:
        return (
          <View style={styles.errorContainer}>
            <ErrorImage />
            <Text style={styles.errorText}>{error.message}</Text>
            <TextButton
              label="Go Back"
              buttonContainerStyle={styles.backButton}
              labelStyle={styles.backButtonText}
              onPress={onGoBack}
            />
          </View>
        );
    }
  };

  return renderErrorContent();
};

export default ReportErrorHandler;

// Helper function to create standardized error objects
export const createErrorState = (
  type: ErrorState['type'],
  message: string,
  retryable = true
): ErrorState => ({
  type,
  message,
  retryable,
});

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later or contact support.',
  AUTH_ERROR: 'Authentication error. Please login again.',
  VALIDATION_ERROR: 'Please fill in all required fields correctly.',
  UPLOAD_ERROR: 'Failed to upload media. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

const styles = {
  errorContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '400' as const,
    textAlign: 'center' as const,
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    height: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: SIZES.radius,
    backgroundColor: '#0E9C67',
    width: '80%' as const,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  backButton: {
    height: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.gray3,
    width: '80%' as const,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
};
