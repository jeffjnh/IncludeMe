import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Connector from "./Connector";
import Verification from "./Verification"
import ConnectModal from "./ConnectModal";


class App extends Component {
	state = {};
	render() {
		return (
			<div>
				<Connector/>
			</div>
		);
	}
}

export default App;
