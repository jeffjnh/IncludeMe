import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ConnectModal from "./ConnectModal";
import URI from "urijs";

class Connector extends Component {

	/**
	 *
	 * Constructor
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			msg: "awedasdwasd",
			messages: "",
			connected: false,
			chime_pin:"",
			email:"",
			ws: null,
			url: ""
		};
	}


	modalUpdate = (pin, mail) => {

		const URL = new URI("wss://b7qy675ije.execute-api.us-east-1.amazonaws.com/Prod")
			.addQuery("chime_pin", pin)
			.addQuery("email", mail);


		console.log(URL.toString());
		var ws = new WebSocket(URL.toString());

		this.setState({
			chime_pin:pin,
			email:mail,
			url: URL.toString() ,
			ws: ws
		});


		ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log("connected");
		};

		ws.onmessage = evt => {
			// on receiving a message, add it to the list of messages
			console.log(evt);
			const message = evt.data;
			console.log(message);
			this.setState({ messages: message });
		};

		ws.onclose = () => {
			console.log("disconnected");
			// automatically try to reconnect on connection loss
			// this.setState({
			// 	ws: new WebSocket(this.state.url)
			// });
		};
	}

	/**
	 *
	 * On SubmitMessage, Called to send a message across the webSocket (this.ws)
	 * @param messageString
	 */
	submitMessage = messageString => {
		if (this.state.ws.readyState === 1) {
			// on submitting the ChatInput form, send the message, add it to the list and reset the input
			console.log("sending message");
			const message = {
				data: messageString,
				message: "sendMessage",
				chime_pin: this.state.chime_pin,
				email: this.state.email
			};
			this.state.ws.send(JSON.stringify(message));
		}
	};

	render() {
		return (
			<div>
				<ConnectModal stateSetter={this.modalUpdate}/>
				<label htmlFor="name">
					<Button
						variant="primary"
						className="m-4"
						onClick={() => this.submitMessage("includeMe")}
					>
						Send
					</Button>
				</label>
				<p>{this.state.messages.toString()}</p>
			</div>
		);
	}
}

export default Connector;
