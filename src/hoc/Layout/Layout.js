import React, { useState } from 'react';
import { connect } from 'react-redux';
import Auxi from '../Auxi/Auxi';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

// using class component here as we need to handle state
// we need to listen from Toolbar and from SideDrawer
const layout = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(true);


  const sideDrawerClosedHandler = () => {
    setShowSideDrawer(false);
  };

  const sideDrawerToggleHandler = () => {
    // Cleaner way to set state when it depends on the old state
    // this.setState((prevState) => {
    //   return { showSideDrawer: !this.state.showSideDrawer };
    // });
    // with react hooks
    setShowSideDrawer(!showSideDrawer);
  };

  return (
    <Auxi>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={showSideDrawer}
        closed={sideDrawerClosedHandler}
      />
      <main className={classes.Content}>{props.children}</main>
    </Auxi>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(layout);
