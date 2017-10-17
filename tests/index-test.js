import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server'
import expect from 'expect';

import MainComponent from 'src/';

describe('Component', () => {
	let props;

  beforeEach(() => {
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

  it("render component", () => {
		expect(render(<MainComponent {...props} />))
			.toContain('<span></span>');
  });
});
