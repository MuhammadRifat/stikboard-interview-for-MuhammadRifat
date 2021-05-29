import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import LaunchData from './LaunchData/LaunchData';
import Pagination from './Pagination/Pagination';
import StatusModal from './StatusModal/StatusModal';

const Dashboard = () => {
    const [launches, setLaunches] = useState([]);
    const [duplicateLaunches, setDuplicateLaunches] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [currentPage, setCurrentPage] = useState([1]);
    const [launchesPerPage, setLaunchesPerPage] = useState([10]);
    const [modalShow, setModalShow] = useState(false);
    const [modalLaunchData, setModalLaunchData] = useState({});

    // Load data from spaceX database
    useEffect(() => {
        setSpinner(true);
        fetch('https://api.spacexdata.com/v3/launches')
            .then(res => res.json())
            .then(data => {
                setLaunches(data);
                setDuplicateLaunches(data);
                setSpinner(false);
            });
    }, [])
    let count = 1;

    // Get current Launches
    const indexOfLastLaunches = currentPage * launchesPerPage;
    const indexOfFirstLaunches = indexOfLastLaunches - launchesPerPage;
    const currentLaunches = launches.slice(indexOfFirstLaunches, indexOfLastLaunches);

    // handling pagination
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // handling category of launches
    const handleLaunchesCategory = (e) => {
        const category = e.target.value;
        if (category === 'Upcoming Launches') {
            const upcomingLaunches = duplicateLaunches.filter(lnch => lnch.upcoming === true);
            setLaunches(upcomingLaunches);
        }
        else if (category === 'Successful Launches') {
            const successfulLaunches = duplicateLaunches.filter(lnch => lnch.launch_success === true);
            setLaunches(successfulLaunches);
        }
        else if (category === 'Failed Launches') {
            const failedLaunches = duplicateLaunches.filter(lnch => lnch.launch_success === false);
            setLaunches(failedLaunches);
        }
        else {
            setLaunches(duplicateLaunches);
        }
    }

    // handling modal 
    const handleModal = (flightNumber) => {
        const modalData = launches.find(lnch => lnch.flight_number === flightNumber);
        setModalLaunchData(modalData);
        setModalShow(true);
    }

    console.log(launches);
    return (
        <Container className="mt-4">
            <StatusModal
                show={modalShow}
                modalLaunchData={modalLaunchData}
                onHide={() => setModalShow(false)}
            />

            <Row>
                <Col md={3}>
                    <select onChange={handleLaunchesCategory}>
                        <option value="All Launches" selected>All Launches</option>
                        <option value="Upcoming Launches">Upcoming Launches</option>
                        <option value="Successful Launches">Successful Launches</option>
                        <option value="Failed Launches">Failed Launches</option>
                    </select>
                </Col>
                <Col md={{ span: 3, offset: 6 }} className="text-right">
                    <select onChange={handleLaunchesCategory}>
                        <option value="All Launches" selected>All Launches</option>
                        <option value="Upcoming Launches">Upcoming Launches</option>
                        <option value="Successful Launches">Successful Launches</option>
                        <option value="Failed Launches">Failed Launches</option>
                    </select>
                </Col>
            </Row>
            <Table bordered className="mt-3">
                <thead>
                    <tr>
                        <th>No:</th>
                        <th>Launched (UTC)</th>
                        <th>Location</th>
                        <th>Mission</th>
                        <th>Orbit</th>
                        <th>Launch Status</th>
                        <th>Rocket</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentLaunches.map(lnch => <LaunchData
                            launch={lnch}
                            handleModal={handleModal}
                            key={lnch.flight_number == '110' ? parseInt(lnch.flight_number) + count++ : lnch.flight_number}
                        />)
                    }
                </tbody>
            </Table>
            {
                spinner &&
                <div className="text-center mt-5">
                    <Spinner animation="border" />
                </div>
            }
            {
                !spinner &&
                !launches.length &&
                <p className="text-center">No result found</p>
            }
            <Pagination
                launchesPerPage={launchesPerPage}
                totalLaunches={launches.length}
                handlePage={handlePage}
            />
        </Container>
    );
};

export default Dashboard;