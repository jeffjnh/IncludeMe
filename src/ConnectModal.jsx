import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Verification from "./Verification";


class ConnectModal extends React.Component{
	constructor(props){
		super(props);
		this.state={
			shown:true
		}
	}


	handleClose = () => {
		this.setState({
			shown:false
		})
	};


	render() {
		return(

			<Modal show={this.state.shown} onHide={this.handleClose}>
				<Modal.Body>
					<Verification/>
				</Modal.Body>
			</Modal>


		);
	}
}

export default ConnectModal;

