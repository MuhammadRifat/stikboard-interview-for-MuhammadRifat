import React from 'react';

const LaunchData = ({ launch, handleModal }) => {
    const { flight_number, launch_date_utc, mission_name, launch_site, rocket, launch_success, upcoming } = launch;

    let launchStatus = launch_success ? 'Success' : upcoming ? 'Upcoming' : 'Failed';
    let bColor = '';

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
        <tr>
            <td>{flight_number}</td>
            <td>{launch_date_utc}</td>
            <td>{launch_site.site_name}</td>
            <td>{mission_name}</td>
            <td>{rocket.second_stage.payloads[0].orbit}</td>
            <td>
                <button
                    onClick={() => handleModal(flight_number)}
                    style={{ backgroundColor: bColor, borderRadius: 10, paddingLeft: 8, paddingRight: 8, border: 'none' }}>
                    {launchStatus}
                </button>
            </td>
            <td>{rocket.rocket_name}</td>
        </tr>
    );
};

export default LaunchData;