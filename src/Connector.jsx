import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class Connector extends Component {
	/**
	 *
	 * Global Variables
	 *
	 * */

	URL = "wss://b7qy675ije.execute-api.us-east-1.amazonaws.com/Prod";
	ws = new WebSocket(this.URL); //Websocket Host

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
			connected: false
		};
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log("connected");
		};

		this.ws.onmessage = evt => {
			// on receiving a message, add it to the list of messages
			console.log(evt);
			const message = evt.data;
			console.log(message);
			this.setState({ messages: message });
		};

		this.ws.onclose = () => {
			console.log("disconnected");
			// automatically try to reconnect on connection loss
			this.setState({
				ws: new WebSocket(URL)
			});
		};
	}

	/**
	 *
	 * On SubmitMessage, Called to send a message across the webSocket (this.ws)
	 * @param messageString
	 */
	submitMessage = messageString => {
		if (this.ws.readyState === 1) {
			// on submitting the ChatInput form, send the message, add it to the list and reset the input
			console.log("sending message");
			const message = { data: messageString, message: "sendMessage" };
			this.ws.send(JSON.stringify(message));
		}
	};

	render() {
		return (
			<div>
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
