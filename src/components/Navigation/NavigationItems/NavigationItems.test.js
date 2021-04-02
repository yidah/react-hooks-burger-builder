import React from 'react';

// shallow renders the component with al its conentent but the conentent is not deeply rendered
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

// Connecting enzyme to render components
configure({adapter: new Adapter()});

describe('<NavigationItems />', ()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper =shallow(<NavigationItems />)
    });

    it('should render two <NavigationItem/> elements if not authenticated', ()=>{
        expect(wrapper.find(NavigationItem)).toHaveLength(2);

    });

    it('should render three <NavigationItem/> elements if authenticated', ()=>{
        wrapper.setProps({isAuthenticated:true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);

    });

    // look for more specific NavigationItem
    it('should render an exact logout button', ()=>{
        wrapper.setProps({isAuthenticated:true});
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);

    });
});