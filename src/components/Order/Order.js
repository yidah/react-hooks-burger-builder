import React from 'react';
import classes from './Order.css';

const order = (props) => {
  const ingredients = [];
  // console.log(props.ingredients);

  for (let ingName in props.ingredients) {
    ingredients.push({
      name: ingName,
      amount: props.ingredients[ingName],
    });
  }

  const ingredientOutput= ingredients.map(ig => {
  return <span 
            key={ig.name}
            style={{
                    textTransform:'capitalize',
                    display:'inline',
                    margin: '0 8px',
                    border:'1px solid #ccc',
                    padding:'5px'}}>{ig.name}({ig.amount})</span>
  })

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>
        Price: <strong>£{props.price.toFixed(2)}</strong>
      </p>
    </div>
  );
};
export default order;
