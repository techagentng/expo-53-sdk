import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Platform } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  appVersion?: string;
  FallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  componentStack: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      componentStack: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Extract component stack from errorInfo
    const componentStack = errorInfo?.componentStack || '';

    // Enhanced error information
    const enhancedError = {
      ...error,
      // Add additional context for floating point errors
      isFloatingPointError: error.message?.includes('Unable to convert string to floating point value'),
      errorContext: {
        // Get the last 10 components from the stack trace
        lastComponents: componentStack.split('\n').slice(0, 10).join('\n'),
        // Get the native stack trace if available
        nativeStack: (error as any).nativeStack || 'No native stack available',
        // Platform-specific information
        platform: Platform.OS,
        platformVersion: Platform.Version,
        // Timestamp
        timestamp: new Date().toISOString(),
        // Current state of the app (if available)
        appState: 'unknown', // We'll get this from global state if needed
      }
    } as Error & { isFloatingPointError: boolean; errorContext: any };

    this.setState({
      error: enhancedError,
      errorInfo: errorInfo,
      componentStack: componentStack
    });

    // Enhanced error logging
    const errorDetails = {
      error: enhancedError.toString(),
      errorName: enhancedError.name,
      errorMessage: enhancedError.message,
      isFloatingPointError: enhancedError.isFloatingPointError,
      errorStack: enhancedError.stack,
      componentStack: componentStack,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      // Add state and props that might be relevant (avoid circular references)
      state: this.state ? '[State object - cannot serialize]' : 'No state',
      props: this.props ? '[Props object - cannot serialize]' : 'No props'
    };

    console.error('ErrorBoundary caught an error:', errorDetails);

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to Sentry if configured and available
    this.sendToSentry(enhancedError, errorInfo, componentStack);
  }

  sendToSentry = (error: Error, errorInfo: React.ErrorInfo | null, componentStack: string) => {
    try {
      // Try to use Sentry if available (from global or require)
      let Sentry: any = null;

      if ((global as any).Sentry) {
        Sentry = (global as any).Sentry;
      } else {
        try {
          Sentry = require('@sentry/react-native');
        } catch (e) {
          console.warn('Sentry not available for error reporting');
          return;
        }
      }

      if (Sentry) {
        Sentry.withScope((scope: any) => {
          // Add a tag for floating point errors
          if ((error as any).isFloatingPointError) {
            scope.setTag('error_type', 'floating_point_conversion');
            scope.setFingerprint(['floating-point-conversion-error']);
          }

          scope.setExtras({
            componentStack: componentStack,
            platform: Platform.OS,
            errorInfo: errorInfo,
            appVersion: this.props.appVersion || 'unknown',
            environment: process.env.NODE_ENV || 'development',
          });

          Sentry.captureException(error);
        });
      }
    } catch (sentryError) {
      console.warn('Failed to send error to Sentry:', sentryError);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      componentStack: ''
    });

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  renderErrorDetails() {
    const { error, componentStack } = this.state;

    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>⚠️ Oops! Something went wrong</Text>

        <Text style={styles.sectionTitle}>Error Details:</Text>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Error:</Text>
          <Text style={styles.detailValue}>{error?.toString() || 'Unknown error'}</Text>

          <Text style={[styles.detailLabel, { marginTop: 10 }]}>Message:</Text>
          <Text style={styles.detailValue}>{error?.message || 'No message'}</Text>

          <Text style={[styles.detailLabel, { marginTop: 10 }]}>Component Stack:</Text>
          <Text style={styles.stackTrace}>
            {componentStack || 'No component stack available'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Try Again"
            onPress={this.handleReset}
            color="#0E9C67"
          />
        </View>
      </ScrollView>
    );
  }

  render() {
    if (this.state.hasError) {
      // Use custom FallbackComponent if provided, otherwise use default
      if (this.props.FallbackComponent && this.state.error) {
        const FallbackComponent = this.props.FallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.handleReset}
          />
        );
      }

      if (__DEV__) {
        return this.renderErrorDetails();
      } else {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Button
              title="Try Again"
              onPress={this.handleReset}
              color="#0E9C67"
            />
          </View>
        );
      }
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  detailBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
  stackTrace: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default ErrorBoundary;
