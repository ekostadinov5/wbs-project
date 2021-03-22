import React from "react";
import {useHistory} from "react-router-dom";

const Error = (props) => {
    const history = useHistory();

    return (
        <div id="main">
            <div className="fof">
                <h1>{props.errorMessage}</h1>
                <div className="mt-4">
                    <button className="btn btn-outline-dark" onClick={() => history.push("/")}>
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Error;
