import React from 'react'
import './Loader.css'
import CustomizedSwitches from '../appLayout/toggleTheme'

function Loader() {
    return (
        <div className='loader-div'>
            <div style={{display:"none"}}>
                <CustomizedSwitches />
            </div>
            <div class="loader"></div>
        </div>
    )
}

export default Loader
