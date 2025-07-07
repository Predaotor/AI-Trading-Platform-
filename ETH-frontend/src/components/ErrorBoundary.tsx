import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="bg-black/20 backdrop-blur-xl border-red-500/20 p-8 max-w-md w-full">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="w-16 h-16 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                <p className="text-purple-300 mb-4">
                  An error occurred while loading the dashboard. This might be due to a network issue or missing backend service.
                </p>
                {this.state.error && (
                  <details className="text-left bg-red-500/10 p-3 rounded-lg mb-4">
                    <summary className="text-red-400 cursor-pointer text-sm font-medium">
                      Error Details
                    </summary>
                    <p className="text-red-300 text-xs mt-2 break-all">
                      {this.state.error.message}
                    </p>
                  </details>
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 