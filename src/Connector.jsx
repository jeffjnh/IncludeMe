import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ConnectModal from "./ConnectModal";
import URI from "urijs";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import "react-sweet-progress/lib/style.css";
import ListGroup from "react-bootstrap/ListGroup";
import Sockette from "sockette";
// const Sockette = require("sockette");

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
			users: [],
			num_include: 0,
			me_included: false,
			me_anonIncl: false,
			anonymous: false
		};
	}

	modalUpdate = (pin, mail, anon) => {
		// console.log(anon);

		const URL = new URI(
			"wss://b7qy675ije.execute-api.us-east-1.amazonaws.com/Prod"
		)
			.addQuery("chime_pin", pin)
			.addQuery("anonymous", anon)
			.addQuery("email", mail);

		// console.log(URL.toString());
		var ws = new Sockette(URL.toString(), {
			timeout: 5e3,
			maxAttempts: 10,
			onopen: e => {
				// console.log("Connected!", e);
				this.setState({ connected: true });
				this.submitMessage("connect");
			},
			onmessage: e => {
				// console.log("Received:", e);
				const message = e.data;
				// console.log(message);
				this.setState({ messages: message });
				// console.log(JSON.parse(message));
				var count_include = 0;
				var users = JSON.parse(message)
					["users"].map(user => {
						var newObj = {};
						newObj.email = user["email"];
						newObj.chime_pin = user["chime_pin"];
						newObj.included = user["included"] === "true";
						newObj.anonIncl = user["anonIncl"] === "true";
						if (newObj.included || newObj.anonIncl) {
							count_include++;
						}
						if (newObj.email === this.state.email) {
							this.setState({ me_included: newObj.included });
						}
						if (newObj.email === this.state.email) {
							this.setState({ me_anonIncl: newObj.anonIncl });
						}
						newObj.anonymous = user["anonymous"] === "true";
						newObj.connectionId = user["connectionId"];
						newObj.tstamp = parseInt(user["tstamp"]);
						newObj.key = user["email"];
						return newObj;
					})
					.sort((a, b) => a.tstamp > b.tstamp);

				this.setState({ num_include: count_include, users: users });
			},
			// onreconnect: e => console.log("Reconnecting...", e),
			// onmaximum: e => console.log("Stop Attempting!", e),
			onclose: e => {
				// console.log("Closed!", e);
				this.setState({ connected: false });
			}
			// onerror: e => console.log("Error:", e)
		});

		this.setState({
			chime_pin: pin,
			email: mail,
			anonymous: anon,
			url: URL.toString(),
			ws: ws
		});
	};

	/**
	 *
	 * On SubmitMessage, Called to send a message across the webSocket (this.ws)
	 * @param messageString
	 */
	submitMessage = messageString => {
		// console.log("attempting to send message");
		// console.log(this.state.ws);
		if (this.state.ws !== null) {
			// on submitting the ChatInput form, send the message, add it to the list and reset the input
			// console.log("sending message");
			var d = new Date();
			var anon = this.state.anonymous;
			if (messageString === "makeAnon") {
				// console.log("change" + anon.toString());
				if (this.state.me_included) {
					messageString = "includeMe";
				} else if (this.state.me_anonIncl) {
					messageString = "anonIncl";
				}
				anon = !anon;
				this.setState({ anonymous: anon });
			}
			// console.log(anon.toString());
			const message = {
				data: messageString,
				message: "sendMessage",
				chime_pin: this.state.chime_pin,
				email: this.state.email,
				anonymous: anon.toString(),
				time: d.getTime().toString()
			};
			// console.log("message" + message.toString());
			this.state.ws.send(JSON.stringify(message));
		}
	};

	render() {
		return (
			<div
				style={{
					margin: "3% auto",
					border: "1px solid black",
					borderRadius: "10px",
					maxWidth: "700px",
					padding: "3%"
				}}
			>
				<ConnectModal stateSetter={this.modalUpdate} />
				<div
					style={{
						//  width: "90%",
						margin: "10px auto"
					}}
				>
					<h1 style={{ textAlign: "center" }}>#IncludeMe</h1>
				</div>
				<div
					style={{
						// width: "90%",
						margin: "10px auto",
						marginLeft: "10px",
						marginRight: "10px",
						padding: "10px",
						border: "1px solid black",
						borderRadius: "10px"
					}}
				>
					<h3 style={{ textAlign: "center" }}>Inclusion Bar</h3>
					<div style={{ margin: "auto" }}>
						<ProgressBar>
							<ProgressBar
								striped
								variant="success"
								now={
									(this.state.num_include /
										this.state.users.length) *
									100
								}
								key={1}
							/>
						</ProgressBar>
					</div>
					<h4 style={{ textAlign: "center" }}>
						{Math.round(
							(this.state.num_include / this.state.users.length) *
								100
						)}
						% ({this.state.num_include} of {this.state.users.length}{" "}
						users) want to be included
					</h4>
				</div>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "stretch"
						// width: "100%",
						// margin: "auto"
						// padding: "10px",
						// justifyContent: "space-between"
						// border: "1px solid black"
					}}
				>
					<div
						style={{
							// width: "90%",
							float: "left",
							padding: "10px",
							margin: "10px",
							border: "1px solid black",
							borderRadius: "10px",
							flexGrow: 1
						}}
					>
						<h3 style={{ textAlign: "center" }}>Controls</h3>
						<div
							style={{
								margin: "auto"
							}}
						>
							<Button
								variant="primary"
								block
								size="sm"
								disabled={!this.state.connected}
								onClick={() => this.submitMessage("includeMe")}
							>
								Include Me
							</Button>
							<Button
								variant="primary"
								block
								size="sm"
								disabled={!this.state.connected}
								onClick={() => this.submitMessage("anonIncl")}
							>
								Include Me Anonymously
							</Button>
							<Button
								variant="primary"
								block
								size="sm"
								disabled={
									!this.state.me_included &&
									!this.state.me_anonIncl
								}
								onClick={() =>
									this.submitMessage("unIncludeMe")
								}
							>
								Don't Include Me
							</Button>
							<Button
								variant="primary"
								block
								size="sm"
								disabled={!this.state.connected}
								onClick={() => this.submitMessage("makeAnon")}
							>
								Display as{" "}
								{this.state.anonymous
									? this.state.email
									: "anonymous"}
							</Button>
							<Button
								variant="primary"
								block
								size="sm"
								disabled={this.state.connected}
								onClick={() =>
									this.modalUpdate(
										this.state.chime_pin,
										this.state.email,
										this.state.anonymous
									)
								}
							>
								Reconnect
							</Button>
						</div>
					</div>
					<div
						style={{
							// width: "90%",
							float: "right",
							minWidth: "100px",
							flexGrow: 1,
							padding: "10px",
							margin: "10px",
							border: "1px solid black",
							borderRadius: "10px"
						}}
					>
						<h3 style={{ textAlign: "center" }}>My Status </h3>
						<h4 style={{ textAlign: "center" }}>
							Connection:{" "}
							{
								<Badge
									variant={
										this.state.connected
											? "success"
											: "danger"
									}
								>
									{" "}
									{this.state.connected
										? "connected"
										: "disconnected"}
								</Badge>
							}
						</h4>
						<h4 style={{ textAlign: "center" }}>
							Name:{" "}
							{this.state.anonymous
								? "anonymous"
								: this.state.email}
						</h4>
					</div>
				</div>
				<div
					style={{
						margin: "10px",
						padding: "10px",
						border: "1px solid black",
						borderRadius: "10px"
						//  width: "90%"
					}}
				>
					<div
						style={{
							height: "250px",
							overflow: "scroll"
						}}
					>
						<ListGroup>
							{console.log(this.state.users)}
							{this.state.users.map(el => (
								<ListGroup.Item
									variant={el.included ? "success" : "light"}
									key={el.email}
									style={{ fontSize: 16 }}
								>
									{el.anonymous ? "anonymous" : el.email}
									{el.included ? " wants to be included" : ""}
								</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				</div>
			</div>
		);
	}
}

export default Connector;
