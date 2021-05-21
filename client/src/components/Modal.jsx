import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

import TextField from '@material-ui/core/TextField'
import ReactDom from 'react-dom'

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

// const formInputStyle = {
//    display: 'flex',
//    flexDirection: 'column'

// }

export class Modal extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            nameError: false,
        }
    }
    render() {
        const {  children, open, onClose } = this.props
        if (!open) return null

        return ReactDom.createPortal(
            <>
            <div style={overlayStyle}></div>
            <div style={modalStyles}>
                <form noValidate autoComplete="off">
                    <TextField
                    label='Enter your Name'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    required
                    onChange={(e) => this.setState({ name: e.target.value})}
                    error={this.state.nameError}
                    helperText={this.state.nameError ? 'you must enter your name' : ''}
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

    submitHandler = (e) => {
        e.preventDefault()
        if (this.state.name === '') {
            this.setState({ nameError: true})
        }

        if (this.state.name) {
            console.log(this.state.name);
        }
    }
}

export default Modal
