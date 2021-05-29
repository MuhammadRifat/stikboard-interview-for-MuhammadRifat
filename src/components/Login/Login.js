import React, { useContext, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import './Login.css';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [loggedInUser, setLoggedInUser] = useContext(userContext);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailValid: true,
        passwordValid: true,
        confirmPasswordValid: true,
        error: ''
    });

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    // For using login and signup
    const handleSubmit = (event) => {
        setSpinner(true);

        if (!newUser && user.email && user.password) {
            const userData = {
                email: user.email,
                password: user.password
            }

            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setLoggedInUser(data);
                        history.replace(from);
                    } else {
                        setLoggedInUser({ error: 'Email or Password is incorrect' });
                    }
                    setSpinner(false);
                })
        }

        if (newUser && user.email && user.password && user.confirmPassword) {
            if (user.password.length === user.confirmPassword.length) {
                const userData = {
                    email: user.email,
                    name: user.name,
                    password: user.password
                }
                const userDetail = { ...user };
                userDetail.error = '';
                setUser(userDetail);

                fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data) {
                            setLoggedInUser({ error: 'Email already exists' });
                        }
                        else {
                            setLoggedInUser({isSuccess: true});
                        }
                        setSpinner(false);
                    })
            }
            else {
                const userDetail = { ...user };
                userDetail.error = "Confirm password do not match";
                setUser(userDetail);
                setSpinner(false);
            }
        }
        event.preventDefault();
    }

    // For accessing user information from input and validating data
    const handleBlur = (event) => {
        let isValid = true;

        if (event.target.name === 'email') {
            isValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if (event.target.name === 'password') {
            isValid = event.target.value.length >= 6 && /\d{1}/.test(event.target.value);
        }
        if (isValid) {
            const newUser = { ...user };
            newUser[event.target.name] = event.target.value;
            newUser[event.target.name + "Valid"] = true;
            setUser(newUser);
        }
        else {
            const newUser = { ...user };
            newUser[event.target.name + "Valid"] = false;
            setUser(newUser);
        }
    }

    // Conditionally showing log in and create new account button
    const handleLogInOrCreate = () => {
        setNewUser(!newUser);
        const newLoggedInUser = { ...loggedInUser };
        newLoggedInUser.error = '';
        setLoggedInUser(newLoggedInUser);
        const userDetail = { ...user };
        userDetail.error = '';
        setUser(userDetail);
    }
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6} className="mt-4">

                    <div className="bg-white p-4" style={{ border: '2px solid lightgray', borderRadius: '10px' }}>
                        {newUser ? <h4>Create an account</h4> : <h4>Log In</h4>}

                        {
                            user.error &&
                            <h6 className="error-message">{user.error}</h6>
                        }
                        {
                            loggedInUser.error &&
                            <h6 className="error-message">{loggedInUser.error}</h6>
                        }
                        {
                            newUser &&
                            loggedInUser.isSuccess &&
                            <h6 style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>Sign up successful</h6>
                        }

                        <form className="login-form" onSubmit={handleSubmit}>
                            {
                                spinner &&
                                <Spinner className="text-center" animation="border" />
                            }
                            {
                                newUser &&
                                <input type="text" onBlur={handleBlur} name="name" placeholder="Name" required />
                            }
                            <br />
                            <input type="text" onBlur={handleBlur} name="email" placeholder="Email" required /><br />
                            {
                                !user.emailValid &&
                                <span style={{ color: 'red' }}>Enter a valid email</span>
                            }
                            <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required /><br />
                            {
                                !user.passwordValid &&
                                <span style={{ color: 'red' }}>Enter a valid password (at least 6 character and number)</span>
                            }
                            {
                                newUser &&
                                <input type="password" onBlur={handleBlur} name="confirmPassword" placeholder="Confirm password" required />
                            }
                            <br />
                            <input id="submit-btn" type="submit" value={newUser ? "Create an account" : "Login"} />
                        </form>

                        <h6 className="mt-3 text-center">
                            {
                                newUser ?
                                    <span>
                                        Already have an account?
                                    <button className="create-btn" onClick={() => handleLogInOrCreate()}>Login</button>
                                    </span>
                                    :
                                    <span>
                                        Don't have an account?
                                    <button className="create-btn" onClick={() => handleLogInOrCreate()}>Create an account</button>
                                    </span>
                            }
                        </h6>
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default Login;