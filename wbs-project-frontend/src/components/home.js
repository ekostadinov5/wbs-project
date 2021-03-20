import React from "react";
import {Link, useHistory} from "react-router-dom";

const Home = () => {
    const history = useHistory();

    const searchByEmail = () => {
        const email = "mailto:" + document.getElementById("searchByEmail").value;
        history.push("/profile/" + email);
    }

    return (
            <div className="d-flex h-100">
                <div className="mx-auto align-self-center">
                    <div className="mb-5 mx-2">
                        <div className="input-group">
                            <input id="searchByEmail" type="search" className="form-control"
                                   placeholder="Search by email"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-dark" title="Search"
                                        onClick={searchByEmail}>
                                    <i className="fa fa-search"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5 mx-2">
                        <Link to="/create" className="btn btn-block btn-outline-success">
                            Create your personal FOAF profile
                        </Link>
                    </div>
                    <div className="mb-5 mx-2">
                        <a href="http://xmlns.com/foaf/spec" className="btn btn-block btn-outline-info">
                            FOAF vocabulary specification
                        </a>
                    </div>
                    {/*<div className="mb-5 mx-2">*/}
                    {/*    <button className="btn btn-block btn-outline-warning"*/}
                    {/*            onClick={() => alert("Not implemented")}>*/}
                    {/*        SPARQL endpoint*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
}

export default Home;
