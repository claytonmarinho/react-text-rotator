import React from 'react';
import {render, findDOMNode, unmountComponentAtNode} from 'react-dom';
import expect from 'expect';

import Component from '../src';

describe('Component', () => {
	let node;
	let props;

  beforeEach(() => {
    node = document.createElement('div');
		props = {
			content: [
				{
			    text: 'text a',
			    className: '',
					animation: 'fade',
		  	},
			],
		  time: 5000,
		  startDelay: 0,
    };
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it("render component", () => {
		render(<Component {...props} />, node, () => {
			expect(node).toExist();
    })
  });
});
