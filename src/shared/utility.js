export const updateObject = (oldObject, updatedProperties) => {
    return{
        ...oldObject,
        ...updatedProperties
    }
}

export const checkValidity = (value, rules) =>{
    let isValid = true;

    // In case we do not defined validation properties in any of our "orderForm" objects
    // otherwise we get an undefined error  
    // We have also added  "validation:{}," to deliveryMethod object in "orderForm" but 
    // therefore the rule below is for double security
    if(!rules){
      return true;
    }

    // adding "&& isValid" force the value to comply with all rules in order to be valid
    if(rules.required){
      isValid = value.trim() !== '' && isValid;
    }
    if(rules.minLength){
      isValid=value.length >= rules.minLength && isValid;
    }
    if(rules.maxLength){
      isValid=value.length <= rules.maxLength && isValid;
    }
    return isValid;
  }