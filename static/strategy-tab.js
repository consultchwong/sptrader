import React from 'react';
import SampleUi from '../strategy/sample-ui.js'

var StrategyTab = React.createClass( {
    getInitialState: function() {
	return {};
    },
    render: function() {
	return(<SampleUi/>);
    }
});

module.exports = StrategyTab;

