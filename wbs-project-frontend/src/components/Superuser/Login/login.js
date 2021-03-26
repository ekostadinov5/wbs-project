import React, {useEffect, useState} from "react";
import SuperuserRepository from "../../../repository/superuserRepository";
import LocalStorageService from "../../../service/localStorageService";
import {useHistory} from "react-router-dom";

const Login = (props) => {
    const [message, setMessage] = useState("");

    const history = useHistory();

    useEffect(() => {
        if (LocalStorageService.getToken()) {
            history.push("/");
        }
    }, []);

    const login = (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (username.length > 0 && password.length > 0) {
            SuperuserRepository.login(username, password).then(promise => {
                LocalStorageService.setToken(promise.headers.authorization);
                LocalStorageService.setIdentifier(promise.headers.identifier);
                props.setSuperuserLoggedIn(true);
                history.push("/");
            }).catch(error => {
                if (error.response.status === 401) {
                    setMessage("Invalid credentials");
                }
            });
        } else {
            setMessage("Invalid credentials");
        }
    }

    const messageSpan = () => {
        return (
            <span className="small text-muted">
                {message}
            </span>
        );
    }

    return (
        <div className="d-flex h-100">
            <div className="mx-auto align-self-center">
                <div className="card">
                    <form className="card-body">
                        <div className="form-group">
                            <input id="username" type="text" className="form-control" placeholder="Username" required/>
                        </div>
                        <div className="form-group">
                            <input id="password" type="password" className="form-control" placeholder="Password"
                                   required/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-outline-dark btn-block" onClick={login}>
                                Login
                            </button>
                        </div>
                        {messageSpan()}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
