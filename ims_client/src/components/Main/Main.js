import React from 'react';
import NavPane from './NavPane/NavPane';
import User from '../../imsdb';


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
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Main.propTypes = {}

export default Main;