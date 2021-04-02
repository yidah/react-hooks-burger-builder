import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props)=>(
    <ul className={classes.NavigationItems}>
        {/* for boolean properties we can just pass the name of the property (active) */}
       <NavigationItem link="/" exact>Burger Builder</NavigationItem>
       {props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem>: null}
       {!props.isAuthenticated
            ?<NavigationItem link="/auth">Authenticate</NavigationItem>
            :<NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
);

export default navigationItems;