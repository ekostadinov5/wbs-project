import React from "react";
import LocalStorageService from "../../../service/localStorageService";

const Logout = (props) => {

    const logout = () => {
        LocalStorageService.clearToken();
        LocalStorageService.clearIdentifier();
        props.setSuperuserLoggedIn(false);
    }

    return props.superuserLoggedIn ? (
        <button id="superuser" className="btn btn-lg btn-danger" onClick={logout}>Logout</button>
    ) : null;
}

export default Logout;
