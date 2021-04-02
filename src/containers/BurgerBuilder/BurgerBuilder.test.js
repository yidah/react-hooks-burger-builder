import React from 'react';
// shallow renders the component with al its conentent but the conentent is not deeply rendered
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { BurgerBuilder} from './BurgerBuilder';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

// Connecting enzyme to render components
configure({adapter: new Adapter()});

describe('<BurgerBuilder />', ()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper =shallow(<BurgerBuilder onInitIngredients={()=>{}} />)
    });

    it('should render two <BuildControls/> when receiving ingredients', ()=>{
        wrapper.setProps({ing:{salad:0}})
        expect(wrapper.find(BuildControls)).toHaveLength(1);

    });

});