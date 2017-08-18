import React from 'react';
import './Loading.css'
import loadingIcon from './loading.svg'

export default () => {
    return (
        <div className='loading'>
            <img src={loadingIcon} alt="animated circular loading icon" />
        </div>
    )
}