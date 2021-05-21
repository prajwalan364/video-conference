import React, { Component } from 'react'
import ReactDom from 'react-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const  modalStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '30%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '2rem',
    zIndex: 1000
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.7)',
    zIndex: 1000
}

export class JoinModal extends Component {
    constructor() {
        super();
        this.state = {
            join: '',
        }
    }
    render() {
        const { onClose, children, open } = this.props
        if (!open) return null

        return ReactDom.createPortal(
            <>
                <div style={overlayStyle}></div>
                <div style={modalStyles}>
                    <form noValidate autoComplete="off">
                    <TextField
                    label='Please Copy the link and share this to your friend'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    required
                    onChange={(e) => this.setState({ join: e.target.value})}
                    >
                { children }
                    </TextField>
                <Button variant='contained' color='primary' onClick={this.submitHandler} style={{marginLeft: '0.2em'}}>ok</Button>
                <Button variant='contained'  onClick={onClose} style={{marginLeft: '1rem'}}>cancel</Button> 
                </form>
                </div>
            </>,
            document.getElementById('portal')
        )
    }
    submitHanlder = (e) => {
        e.preventDefault(e) 
        if (this.state.join) 
        console.log(this.state.join)
    }
}

export default JoinModal
