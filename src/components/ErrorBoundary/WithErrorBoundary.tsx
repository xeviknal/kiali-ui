import * as React from 'react';
import { Alert } from 'patternfly-react';
import ErrorBoundary from './ErrorBoundary';
import { Tab, TabProps } from '@patternfly/react-core';
import { FunctionComponent } from 'react';

interface WithMessage {
  message: string;
}

const withErrorBoundary = <P extends object>(WrappedComponent: FunctionComponent<P>) =>
  class WithErrorBoundary extends React.Component<P & WithMessage> {
    alert() {
      return (
        <div className="card-pf-body">
          <Alert type="warning">{this.props.message || 'Something went wrong rending this component'}</Alert>
        </div>
      );
    }

    render() {
      return (
        <WrappedComponent {...this.props}>
          <ErrorBoundary fallBackComponent={this.alert()}>{this.props.children}</ErrorBoundary>
        </WrappedComponent>
      );
    }
  };

export const TabWithErrorBoundary = withErrorBoundary<TabProps>(Tab);
