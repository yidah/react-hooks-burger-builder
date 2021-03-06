import React, { useEffect, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// lazy loading components with React.lazy introduced in React 16.6 
// in the app with class components we built this functionality manually
// we build the asyncComponent in folder hoc
// in order to use lazy we need to import Suspense and wrap the routes with it 
// and use render to indicate which component should render async
const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});
const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const app = (props) => {
  // Object distructoring to get something (this case onTryAutoSignup) out of props into a different constant 
  const {onTryAutoSignup} = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  let routes = (
    <Switch>
      <Route path="/auth" render={(props)=><Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      {/* For anything unknown go to root */}
      <Redirect to="/" />
    </Switch>
  );
  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={(props)=><Checkout {...props}/>} />
        <Route path="/orders" render={(props)=><Orders {...props}/>} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={(props)=><Auth {...props}/>} />
        <Route path="/" exact component={BurgerBuilder} />
        {/* For anything unknown go to root */}
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Layout><Suspense fallback={<p>Loading...</p>}>{routes}</Suspense></Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(app);
