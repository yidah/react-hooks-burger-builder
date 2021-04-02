import React from 'react';
import classes from './NavigationItem.css';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
    {/* The path in "to" attribute is what determines whether this is the active route or not.
        If all routes start with slash every route will be treated as active to fix this we add exact attribute
        
        "exact" will be attached to all routes in this case, if we want exact for specific routes then we can pass 
        a exact property so it only applies to the routes defined with exact  
    */}
    <NavLink to={props.link} exact={props.exact} activeClassName={classes.active}>
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
