import React from 'react'

import Loader from "../../../static/assets/images/EclipseLoader.gif"

export default function ConfirmLoadingError(props) {
    return (
        <div className="confirm-loading-error-wrapper">
            {props.confirm && !props.loading && !props.error ? <p className='confirm'>Are you sure you want to delete {props.item}? Press again to confirm.</p> : null}
            {props.loading ? <p><img src={Loader} alt="Loading" /></p> : null}
            {props.error ? <p className='error'>{props.error}</p> : null}
        </div>
    )
}