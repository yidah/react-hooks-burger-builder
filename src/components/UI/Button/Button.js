import React from 'react';
import classes from './Button.css';

const button = (props)=>(
    // Add {props.children} to use it as a normal button
<button disabled={props.disabled}
        className={[classes.Button, classes[props.btnType]].join(' ')}  
        onClick={props.clicked}>{props.children}</button>
)

export default button;