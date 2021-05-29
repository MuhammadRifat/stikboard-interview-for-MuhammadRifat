import React from 'react';
import { Col, Image, Modal, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube, faWikipediaW } from '@fortawesome/free-brands-svg-icons'

const StatusModal = (props) => {
    const { details, links, mission_name, rocket, launch_success, upcoming, flight_number, launch_date_utc } = props?.modalLaunchData;

    // set status
    let launchStatus = launch_success ? 'Success' : upcoming ? 'Upcoming' : 'Failed';
    let bColor = '';

    // conditionally change status color
    if (launchStatus === 'Success') {
        bColor = 'rgb(144, 255, 144)';
    }
    else if (launchStatus === 'Failed') {
        bColor = 'rgb(255, 148, 148)';
    }
    else {
        bColor = 'rgb(255, 255, 155)';
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Row>
                    <Col md={3}>
                        <Image src={links?.mission_patch_small} alt="" className="w-75" />
                    </Col>

                    <Col md={4}>
                        <h5>{mission_name}</h5>
                        <p>{rocket?.rocket_name}</p>
                        <a href={links?.wikipedia} target="_blank">
                            <FontAwesomeIcon icon={faWikipediaW} className="mr-2" />
                        </a>
                        <a href={links?.video_link} target="_blank">
                            <FontAwesomeIcon icon={faYoutube} className="ml-1" />
                        </a>
                    </Col>

                    <Col md={2}>
                        <span style={{ backgroundColor: bColor, borderRadius: 10, paddingLeft: 8, paddingRight: 8, border: 'none' }}>{launchStatus}</span>
                    </Col>
                </Row>
            </Modal.Header>

            <Modal.Body>
                <p>{details} <a href={links?.wikipedia}>Wikipedia</a></p>
                
                <Table className="mt-3">
                    <tbody>
                        <tr>
                            <td>Flight Number</td>
                            <td>{flight_number}</td>
                        </tr>
                        <tr>
                            <td>Mission Name</td>
                            <td>{mission_name}</td>
                        </tr>
                        <tr>
                            <td>Rocket Type</td>
                            <td>{rocket?.rocket_type}</td>
                        </tr>
                        <tr>
                            <td>Rocket Name</td>
                            <td>{rocket?.rocket_name}</td>
                        </tr>
                        <tr>
                            <td>Manufacturer</td>
                            <td>{rocket?.second_stage.payloads[0].manufacturer}</td>
                        </tr>
                        <tr>
                            <td>Nationality</td>
                            <td>{rocket?.second_stage.payloads[0].nationality}</td>
                        </tr>
                        <tr>
                            <td>Launch Date</td>
                            <td>{launch_date_utc}</td>
                        </tr>
                        <tr>
                            <td>Payload Type</td>
                            <td>{rocket?.second_stage.payloads[0].payload_type}</td>
                        </tr>
                        <tr>
                            <td>Orbit</td>
                            <td>{rocket?.second_stage.payloads[0].orbit}</td>
                        </tr>
                        <tr>
                            <td>Launch Site</td>
                            <td>{flight_number}</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};

export default StatusModal;