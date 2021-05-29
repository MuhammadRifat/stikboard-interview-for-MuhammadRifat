import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import LaunchData from './LaunchData/LaunchData';
import Pagination from './Pagination/Pagination';
import StatusModal from './StatusModal/StatusModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
    const [launches, setLaunches] = useState([]);
    const [duplicateLaunches, setDuplicateLaunches] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [currentPage, setCurrentPage] = useState([1]);
    const [launchesPerPage, setLaunchesPerPage] = useState([10]);
    const [modalShow, setModalShow] = useState(false);
    const [modalLaunchData, setModalLaunchData] = useState({});
    const [pickDate, setPickDate] = useState(new Date());

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

    // handling past launches
    const handlePastLaunches = (e) => {
        const pastTime = e.target.value;
        if(pastTime === 'Past week') {
            handleFilterPastDate(7);
        }
        else if(pastTime === 'Past month') {
            handleFilterPastDate(30);
        }
        else if(pastTime === 'Past 3 months') {
            handleFilterPastDate(90);
        }
        else if(pastTime === 'Past 6 months') {
            handleFilterPastDate(183);
        }
        else if(pastTime === 'Past year') {
            handleFilterPastDate(365);
        }
        else if(pastTime === 'Past 2 year') {
            handleFilterPastDate(730);
        }
        else {
            setLaunches(duplicateLaunches);
        }
    }

    // Filter launches after selected past time
    const handleFilterPastDate = (days) => {
        const pastDate = new Date(new Date().getTime()-(days*24*60*60*1000));
        const pastTime = Math.abs(pastDate);

        const pastLaunches = duplicateLaunches.filter(lnch => {
            const launchDate = new Date(lnch.launch_date_utc);
            const launchTime = Math.abs(launchDate);

            if(pastTime < launchTime) {
                return lnch;
            }
        })

        setLaunches(pastLaunches);
    }

    // Filter after launches of selected date
    const handleDatePicker = (date) => {
        setPickDate(date);
        const selectedDate = new Date(date.getTime());
        const selectedTime = Math.abs(selectedDate);

        const pastLaunches = duplicateLaunches.filter(lnch => {
            const launchDate = new Date(lnch.launch_date_utc);
            const launchTime = Math.abs(launchDate);

            if(selectedTime < launchTime) {
                return lnch;
            }
        })

        setLaunches(pastLaunches);

    }

    // handling modal 
    const handleModal = (flightNumber) => {
        const modalData = launches.find(lnch => lnch.flight_number === flightNumber);
        setModalLaunchData(modalData);
        setModalShow(true);
    }

    return (
        <Container className="mt-4">
            <StatusModal
                show={modalShow}
                modalLaunchData={modalLaunchData}
                onHide={() => setModalShow(false)}
            />

            <Row>
                <Col md={6}>

                    <DatePicker selected={pickDate} onChange={(date) => handleDatePicker(date)} />
                    <select onChange={handlePastLaunches}>
                        <option value="All time" selected>All time</option>
                        <option value="Past week">Past week</option>
                        <option value="Past month">Past month</option>
                        <option value="Past 3 months">Past 3 months</option>
                        <option value="Past 6 months">Past 6 months</option>
                        <option value="Past year">Past year</option>
                        <option value="Past 2 year">Past 2 year</option>
                    </select>
                </Col>
                <Col md={{ span: 3, offset: 3 }} className="text-right">
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