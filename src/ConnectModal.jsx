import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Verification from "./Verification";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


class ConnectModal extends React.Component{
	constructor(props){
		super(props);
		this.state={
			shown:true,
			email:"",
			pin:""
		}
	}



	updatePin = (e) => {
		this.setState({pin: e.target.value})
	};
	updateEmail = (e) =>  {
		this.setState({email: e.target.value})
	};



	handleClose = () => {
		this.setState({
			shown:false
		})
	};

	render() {
		return(

			<Modal show={this.state.shown} onHide={this.handleClose}>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formBasicEmail" >
							<Form.Label>Amazon Email</Form.Label>
							<Form.Control type="email" placeholder="Jeff@Amazon.com" value={this.state.email} onChange={this.updateEmail}/>
							<Form.Text className="text-muted">
								Amazon email required.
							</Form.Text>
						</Form.Group>
						<Form.Group controlId="formBasicPin">
							<Form.Label>Chime Meeting Pin/ID</Form.Label>
							<Form.Control type="input" placeholder="Chime Pin" value={this.state.pin} onChange={this.updatePin}/>
						</Form.Group>
						<Form.Group controlId="formBasicChecbox">
							<Form.Check type="checkbox" label="Keep me Anonymous" />
						</Form.Group>
						<Button variant="primary" onClick={() => {
							console.log(this.state.pin);
							console.log(this.state.email);
							this.props.stateSetter(this.state.pin, this.state.email);
							console.log("setting State");
							this.handleClose();
						}}>
							Connect
						</Button>
					</Form>
				</Modal.Body>
			</Modal>


		);
	}
}
export default ConnectModal;

