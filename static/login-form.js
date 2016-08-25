import React from 'react';

var LoginForm = React.createClass({
    getInitialState: function() {
	var l = this;
	$.getJSON("/logininfo", function(d) {
	    d.password = '';
	    l.setState({"data" : d});
	});
	return {
	    data: {
		host: '',
		port: 8080,
		license: '',
		app_id: '',
		user_id: '',
		password: ''
	    }
	};
    },
    onChange: function(e) {
	var change = this.state.data;
	change[e.target.name] = e.target.value;
	this.setState({"data": change});
    },
    onSubmit: function(e) {
	this.props.onSubmit(this.state.data);
    },
    render: function() {
	return (<form>
		<Modal show={this.props.show}>
		<Modal.Header>
		<Modal.Title>Login</Modal.Title>
		</Modal.Header>
		<Modal.Body>
		<label>{this.props.label}</label>
		<FieldGroup
	    name="host"
	    type="text"
	    label="Host"
	    placeholder="Enter host"
	    onChange={this.onChange}
	    value={this.state.data.host}
		/>
		<FieldGroup
	    name="port"
	    type="text"
	    label="Port"
	    placeholder="Enter port"
	    onChange={this.onChange}
	    value={this.state.data.port}
		/>
		<FieldGroup
	    name="license"
	    type="text"
	    label="License"
	    placeholder="Enter license"
	    onChange={this.onChange}
	    value={this.state.data.license}
		/>
		<FieldGroup
	    name="app_id"
	    type="text"
	    label="App Id"
	    placeholder="Enter app id"
	    onChange={this.onChange}
	    value={this.state.data.app_id}
		/>
		<FieldGroup
	    name="user_id"
	    type="text"
	    label="User Id"
	    placeholder="Enter user id"
	    onChange={this.onChange}
	    value={this.state.data.user_id}
		/>
		<FieldGroup
	    name="password"
	    label="Password"
	    type="password"
	    onChange={this.onChange}
	    value={this.state.data.password}
		/>
		</Modal.Body>
		<Modal.Footer>
		<Button
	    onClick={this.onSubmit}>
		Login
	    </Button>
		</Modal.Footer>
		</Modal>
		</form>
	);
    }
});
module.exports = LoginForm;
