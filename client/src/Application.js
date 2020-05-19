import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AppProvider } from '@8base/react-sdk';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import { BoostProvider, AsyncContent } from '@8base/boost';
import { ToastContainer, toast } from 'react-toastify';

import { ProtectedRoute } from 'shared/components';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

import { MainPlate, ContentPlate, Nav } from './components';
import { Auth as AuthCallback } from './routes/auth';
import { Orders } from './routes/orders';
import { Clients } from './routes/clients';
import { ClientInfo}  from './routes/clients/clientInfo';
import { Products } from './routes/products';
import { OrderInfo } from './routes/orders/ordersInfo';


const REACT_APP_WORKSPACE_ENDPOINT = 'https://api.8base.com/ck9woia3o000507k0bmw1emmn';
const WEB_8BASE_CLIENT_ID = 'qhPb5zN1OTNyBw1hfcWW2gmV02Opwa4q';
const WEB_8BASE_CLIENT_DOMAIN = 'secure.8base.com';

const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.WEB_8BASE,
  subscribable: true,
}, {
  clientId: WEB_8BASE_CLIENT_ID,
  domain: WEB_8BASE_CLIENT_DOMAIN,
  redirectUri: `${window.location.origin}/auth/callback`,
  logoutRedirectUri: `${window.location.origin}/logout`,
});

class Application extends React.PureComponent {
  renderContent = ({ loading }) => (
    <AsyncContent loading={loading} stretch>
      <Switch>
        <Route path="/auth" component={AuthCallback} />
        <Route>
          <MainPlate>
            <Nav.Plate color="BLUE">
              <Nav.Item icon="Group" to="/clients" label="Clients" />
              <Nav.Item icon="Table" to="/orders" label="Orders" />
              <Nav.Item icon="Tables" to="/products" label="Products" />
            </Nav.Plate>
            <ContentPlate>
              <Switch>
                <ProtectedRoute exact path="/clients" component={Clients} />
                <ProtectedRoute path="/clients/info/:index" component={ClientInfo} />
                <ProtectedRoute exact path="/orders" component={Orders} />
                <ProtectedRoute path="/orders/info/:index" component={OrderInfo} />
                <ProtectedRoute exact path="/products" component={Products} />
                <Redirect to="/clients" />
              </Switch>
            </ContentPlate>
          </MainPlate>
        </Route>
      </Switch>
    </AsyncContent>
  );

  onRequestSuccess = ({ operation }) => {
    const message = operation.getContext()[TOAST_SUCCESS_MESSAGE];

    if (message) {
      toast.success(message);
    }
  };

  onRequestError = ({ graphQLErrors }) => {
    const hasGraphQLErrors = Array.isArray(graphQLErrors) && graphQLErrors.length > 0;

    if (hasGraphQLErrors) {
      graphQLErrors.forEach(error => {
        toast.error(error.message);
      });
    }
  };

  render() {
    return (
      <BrowserRouter>
        <BoostProvider>
          <AppProvider
            uri={REACT_APP_WORKSPACE_ENDPOINT}
            authClient={authClient}
            onRequestSuccess={this.onRequestSuccess}
            onRequestError={this.onRequestError}
          >
            {this.renderContent}
          </AppProvider>
          <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        </BoostProvider>
      </BrowserRouter>
    );
  }
}

export { Application };
