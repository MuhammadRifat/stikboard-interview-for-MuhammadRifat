import React, { useEffect, useState } from 'react';
import { Container, Spinner, Table } from 'react-bootstrap';
import LaunchData from './LaunchData/LaunchData';
import Pagination from './Pagination/Pagination';

const Dashboard = () => {
    const [launches, setLaunches] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [currentPage, setCurrentPage] = useState([1]);
    const [launchesPerPage, setLaunchesPerPage] = useState([10]);

    // Load data from spaceX database
    useEffect(() => {
        setSpinner(true);
        fetch('https://api.spacexdata.com/v3/launches')
            .then(res => res.json())
            .then(data => {
                setLaunches(data);
                setSpinner(false);
            });
    }, [])
    let count = 1;

    // Get current Launches
    const indexOfLastLaunches = currentPage * launchesPerPage;
    const indexOfFirstLaunches = indexOfLastLaunches - launchesPerPage;
    const currentLaunches = launches.slice(indexOfFirstLaunches, indexOfLastLaunches);

    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    console.log(launches);
    return (
        <Container className="mt-4">
            <Table striped bordered hover>
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
                        currentLaunches.map(lnch => <LaunchData launch={lnch} key={lnch.flight_number == '110' ? parseInt(lnch.flight_number) + count++ : lnch.flight_number}></LaunchData>)
                    }
                </tbody>
            </Table>
            {
                spinner && <div className="text-center mt-5"><Spinner animation="border" /></div>
            }
            <Pagination launchesPerPage={launchesPerPage} totalLaunches={launches.length} handlePage={handlePage}></Pagination>
        </Container>
    );
};

export default Dashboard;