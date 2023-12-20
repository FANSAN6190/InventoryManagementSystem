import React,{ReactNode} from 'react'
import NavPane from './NavPane/NavPane';
import PropTypes from 'prop-types'
class Main extends React.Component {
    
    render() {
        const mainStyle={
            background: "linear-gradient(45deg, white, skyBlue, white)",
            height:"100vh"
        }

        return (
            <div className={"container-fluid"} style={mainStyle} >
                <NavPane></NavPane>
            </div>
            
        );
    }
}

Main.propTypes = {}

export default Main;