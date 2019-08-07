import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";




class Verification extends React.Component{

	render() {
		return(
			<div style={{
				// width:"20%"
			}}
			>
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Amazon Email</Form.Label>
						<Form.Control type="email" placeholder="Jeff@Amazon.com"/>
						<Form.Text className="text-muted">
							Amazon email required.
						</Form.Text>
					</Form.Group>
					<Form.Group controlId="formBasicPin">
						<Form.Label>Chime Meeting Pin/ID</Form.Label>
						<Form.Control type="password" placeholder="Chime Pin" />
					</Form.Group>
					<Form.Group controlId="formBasicChecbox">
						<Form.Check type="checkbox" label="Keep me Anonymous" />
					</Form.Group>
					<Button variant="primary" type="submit">
						Connect
					</Button>
				</Form>
			</div>
		);
	}
}
export default Verification;




