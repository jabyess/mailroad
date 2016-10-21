import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './jsx/main.jsx';
require('./sass/main.sass');

ReactDOM.render(
	<MainContainer/>,
	document.getElementById('emailbuilder-root')
);
