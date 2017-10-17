import React, {Component} from 'react'
import {render} from 'react-dom'

import ReactTextRotator from '../../src'

const content = [
	{
		text: 'A',
		className: 'black',
		animation: 'fade',
	},
	{
		text: 'B',
		className: 'red',
		animation: 'fade',
	},
]

const Demo = () => (
	<div>
	  <h1>React Text Rotator</h1>
	  <ReactTextRotator
			content={content}
			time={5000}
			startDelay={2000}
		/>
	</div>
)

render(<Demo/>, document.querySelector('#demo'))
