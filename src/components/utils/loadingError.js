import React from 'react'

import Loader from "../../../static/assets/images/EclipseLoader.gif"

export default function LoadingError(props) {
    return (
        <div className="loading-error-wrapper">
            {props.loading ? <p><img src={Loader} alt="Loading" /></p> : null}
            {props.error ? <p className='error'>{props.error}</p> : null}
        </div>
    )
}