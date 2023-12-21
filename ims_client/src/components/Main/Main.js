import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavPane from './NavPane/NavPane';
import Dashboard from '../Dashboard/Dashboard'; // Import your Dashboard component
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap';


const mainStyle={
    background: "linear-gradient(45deg, #757575, #00649e, #757575)",
    minHeight:"150vh"
};

const mainContentStyle={
    float:"right",
    display: 'flex',
    backgroundColor: '#e6e6fa90',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    borderRadius:'20px',
    marginTop: '10px',
    padding:'20px',
    fontSize: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
};
class Main extends React.Component {
    render() {
        return (
            <div className={"container-fluid"} style={mainStyle} >
                <NavPane></NavPane>
                <div className={"container-fluid"} style={mainContentStyle}>
                    <br></br>
                    <h1>Welcome to Our Website!</h1>
                    <span style={{display: 'flex', justifyContent: 'center', height: '100%', paddingBottom:'50px'}}>
                        <img style={{height:'20%', width:'80%'}} src={process.env.PUBLIC_URL + '/ims_home_pic7.png'}/>
                    </span>      
                    <h2>
                        Manage your inventory with ease!
                    </h2>
                    <h3>
                        Get Started by Registering or Logging In!
                    </h3>        
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button variant="primary" style={{marginRight: '10px'}}>Login</Button>
                        <Button variant="success">Register</Button>
                    </div>
                </div>
            </div>
        );
    }
}

Main.propTypes = {}

export default Main;