import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ConnectModal from "./ConnectModal";
import URI from "urijs";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import "react-sweet-progress/lib/style.css";
import ListGroup from "react-bootstrap/ListGroup";
import Sockette from "sockette";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
			anonymous: false,
			copied: false,
			showCopy: false
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
				/* prettier-ignore */
				var users = JSON.parse(message)["users"].map(user => {
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
						// console.log(newObj.tstamp);
						newObj.key = user["email"];
						return newObj;
					})
					.sort((a, b) => b.tstamp - a.tstamp);

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

	getColor = pct => {
		var percentColors = [
			{ pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
			{ pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
			{ pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
		];
		for (var i = 1; i < percentColors.length - 1; i++) {
			if (pct <= percentColors[i].pct) {
				break;
			}
		}
		var lower = percentColors[i - 1];
		var upper = percentColors[i];
		var range = upper.pct - lower.pct;
		var rangePct = (pct - lower.pct) / range;
		var pctLower = 1 - rangePct;
		var pctUpper = rangePct;
		var color = {
			r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
			g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
			b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
		};
		return "rgb(" + [color.r, color.g, color.b].join(",") + ")";
		// or output as hex if preferred
	};
	clipboardTime = () => {
		if (!this.state.showCopy) {
			this.setState({ showCopy: true });
			setTimeout(() => {
				this.setState({ showCopy: false });
			}, 5000);
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
				{/* <Modal show={this.state.showToast} backdrop={false}>
					<Toast
						onClose={() => this.setState({ showToast: false })}
						show={this.state.showToast}
						delay={3000}
						autohide
						style={{
							backgroundColor: "rgb(83, 164, 81",
							color: "white"
						}}
					>
						<Toast.Body>
							Woohoo, you're reading this text in a Toast!
						</Toast.Body>
					</Toast>
				</Modal> */}
				<div
					style={{
						//  width: "90%",
						margin: "10px auto"
					}}
				>
					<h1 style={{ textAlign: "center" }}>
						<strong>#IncludeMe</strong>
					</h1>
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
					<h3 style={{ textAlign: "center" }}>
						<strong>Inclusion Bar</strong>
					</h3>
					<div style={{ margin: "auto" }}>
						<ProgressBar style={{ border: "1px solid black" }}>
							<ProgressBar
								striped
								style={{
									background: this.getColor(
										1 -
											this.state.num_include /
												this.state.users.length
									)
								}}
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
						<h3 style={{ textAlign: "center" }}>
							<strong>Controls</strong>
						</h3>
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
							{/* <h5 style={{ textAlign: "center" }}> */}
							<CopyToClipboard
								text={new URI(window.location)
									.addQuery("chime_pin", this.state.chime_pin)
									.toString()}
								onCopy={() => this.setState({ copied: true })}
							>
								<Button
									block
									onClick={this.clipboardTime}
									disabled={this.state.showCopy}
									variant={
										this.state.showCopy
											? "success"
											: "primary"
									}
									size="sm"
								>
									{this.state.showCopy
										? "Link Copied to Clipboard!"
										: "Copy Meeting Link"}
								</Button>
							</CopyToClipboard>
							{/* </h5> */}
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
						<h3 style={{ textAlign: "center" }}>
							<strong>My Status</strong>
						</h3>
						<h4 style={{ textAlign: "left" }}>
							<strong>Connection: </strong>
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
						<h4 style={{ textAlign: "left" }}>
							<strong>Name: </strong>
							{this.state.anonymous
								? "anonymous"
								: this.state.email}
						</h4>
						<h4 style={{ textAlign: "left" }}>
							<strong>Chime Pin: </strong>
							{this.state.chime_pin}
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
					<h3 style={{ textAlign: "center" }}>
						<strong>Meeting Members</strong>
					</h3>
					<div
						style={{
							height: "250px",
							overflow: "scroll"
						}}
					>
						<ListGroup>
							{/* {console.log(this.state.users)} */}
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
