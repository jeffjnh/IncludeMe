import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ConnectModal from "./ConnectModal";
import URI from "urijs";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import ListGroup from "react-bootstrap/ListGroup";

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
			chime_pin: "",
			email: "",
			ws: null,
			url: "",
			users: [
				{ email: "chuteec@amazon.com", include: false },
				{ email: "johajeff@amazon.com", include: true },
				{ email: "jeff@amazon.com", include: false },
				{ email: "test@amazon.com", include: true },
				{ email: "other@amazon.com", include: false }
			]
		};
	}

	modalUpdate = (pin, mail, anon) => {
		console.log(anon);

		const URL = new URI(
			"wss://b7qy675ije.execute-api.us-east-1.amazonaws.com/Prod"
		)
			.addQuery("chime_pin", pin)
			.addQuery("anonymous", anon)
			.addQuery("email", mail);

		console.log(URL.toString());
		var ws = new WebSocket(URL.toString());

		this.setState({
			chime_pin: pin,
			email: mail,
			url: URL.toString(),
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
	};

	/**
	 *
	 * On SubmitMessage, Called to send a message across the webSocket (this.ws)
	 * @param messageString
	 */
	submitMessage = messageString => {
		if (this.state.ws !== null && this.state.ws.readyState === 1) {
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
			<div style={{ margin: "10%" }}>
				<ConnectModal stateSetter={this.modalUpdate} />
				<div style={{ width: "80%", margin: "auto" }}>
					<h2>Overall Meeting</h2>
					<Progress percent={78} />
				</div>
				<div style={{ width: "80%", margin: "auto" }}>
					<Button block>Included</Button>
					<Button
						variant="primary"
						block
						onClick={() => this.submitMessage("includeMe")}
					>
						IncludeMe
					</Button>
				</div>
				<div style={{ margin: "auto", width: "80%" }}>
					<div
						style={{
							marginTop: "5%",
							height: "200px",
							overflow: "scroll"
						}}
					>
						<ListGroup>
							{this.state.users.map(el => (
								<ListGroup.Item
									action
									variant={el.include ? "success" : "danger"}
									key={el.email}
								>
									{el.email}
								</ListGroup.Item>
							))}
							{/* <ListGroup.Item>No style</ListGroup.Item>
							<ListGroup.Item variant="primary">
								Primary
							</ListGroup.Item>
							<ListGroup.Item action variant="secondary">
								Secondary
							</ListGroup.Item>
							<ListGroup.Item action variant="success">
								Success
							</ListGroup.Item>
							<ListGroup.Item action variant="danger">
								Danger
							</ListGroup.Item>
							<ListGroup.Item action variant="warning">
								Warning
							</ListGroup.Item>
							<ListGroup.Item action variant="info">
								Info
							</ListGroup.Item>
							<ListGroup.Item action variant="light">
								Light
							</ListGroup.Item>
							<ListGroup.Item action variant="dark">
								Dark
							</ListGroup.Item> */}
						</ListGroup>
					</div>
				</div>
				<p>{this.state.messages.toString()}</p>
			</div>
		);
	}
}

export default Connector;
