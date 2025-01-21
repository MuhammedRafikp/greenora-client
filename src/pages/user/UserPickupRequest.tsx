import React from 'react';
import NavBar from '../../components/user/Navbar';
import Request from '../../components/user/Request';
import PickupRequest from '../../components/user/PickupRequest';

const UserPickupRequest: React.FC = () => {
    return (
        <div>
            <NavBar />
            {/* <RequestForm /> */}
            {/* <PickupRequest /> */}
            <Request />
        </div>
    )
}

export default UserPickupRequest;
