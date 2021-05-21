import React, { Component } from 'react'
import Button from'@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddCircleOutlineRounded';

const buttonWrapperStyles = {
  position: 'relative',
  zIndex: 1,
  top: '35%',
  padding: '1.2rem'
}

export class CreateRoom extends Component {
   constructor() {
       super();
       this.state = {
           name: ''
       }
   } 
    render() {
        const { newBtn } = this.props
        return (
            <>
            <div style={buttonWrapperStyles}>
            <Button 
                variant='contained' 
                color='primary' 
                onClick={newBtn}
                style={{  fontSize: '1.5rem' }}
                onSubmit={(e) => this.setState({ name: e.target.value })}
                onChange={this.buttonHandler}>
                New<AddBoxIcon fontSize='inherit' />
            </Button>
            </div>
            </>
        )
    }

    //this function will store given string
    buttonHandler = () => {
        console.log(this.state.name)
    }
}

export default CreateRoom
