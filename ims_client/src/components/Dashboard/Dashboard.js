import React from 'react'
import PropTypes from 'prop-types'

const dashboardStyle = {
    float:"right",
    display: 'flex',
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    borderRadius:'20px',
    marginTop: '40px',
    paddingTop: '200px',
    paddingBottom: '50px',
    fontSize: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
}
function Dashboard(props) {
  return (
    <div className={"container-fluid"} style={dashboardStyle}>
        
    </div>
  )
}

Dashboard.propTypes = {}

export default Dashboard
