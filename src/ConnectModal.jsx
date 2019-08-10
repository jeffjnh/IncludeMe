import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQueryParams from "react-query-params";

class ConnectModal extends ReactQueryParams {
	constructor(props) {
		super(props);
		// console.log(this.queryParams.chime_pin);
		this.state = {
			shown: true,
			email: "",
			pin: this.queryParams.chime_pin,
			anonymous: false
		};
	}

	// componentDidMount() {
	// let search = window.location.search;
	// let params = new URLSearchParams(search);
	// let foo = params.get("query");
	// console.log(search);
	// console.log(params);
	// console.log(foo);
	// }

	updatePin = e => {
		this.setState({ pin: e.target.value });
	};
	updateEmail = e => {
		this.setState({ email: e.target.value });
	};

	updateAnonymous = e => {
		this.setState({ anonymous: !this.state.anonymous });
		// console.log(this.state.anonymous);
	};

	handleClose = () => {
		this.setState({
			shown: false
		});
	};

	render() {
		return (
			<Modal
				backdrop="static"
				show={this.state.shown}
				onHide={this.handleClose}
			>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Amazon Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Jeff@Amazon.com"
								autoFocus
								value={this.state.email}
								onChange={this.updateEmail}
							/>
							<Form.Text className="text-muted">
								Amazon email required.
							</Form.Text>
						</Form.Group>
						<Form.Group controlId="formBasicPin">
							<Form.Label>Chime Meeting Pin/ID</Form.Label>
							<Form.Control
								type="input"
								placeholder="Chime Pin"
								value={this.state.pin || ""}
								onChange={this.updatePin}
								defaultChecked={this}
							/>
						</Form.Group>
						<Form.Group
							controlId="formBasicChecbox"
							value={this.state.anonymous}
							onChange={this.updateAnonymous}
						>
							<Form.Check
								type="checkbox"
								label="Keep me Anonymous"
							/>
						</Form.Group>
						<Button
							variant="primary"
							onClick={() => {
								// console.log(this.state.pin);
								// console.log(this.state.email);
								this.props.stateSetter(
									this.state.pin,
									this.state.email,
									this.state.anonymous
								);
								// console.log("setting State");
								this.handleClose();
							}}
							disabled={
								this.state.pin === "" ||
								this.state.email === "" ||
								this.state.pin === undefined
							}
						>
							Connect
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		);
	}
}
export default ConnectModal;
