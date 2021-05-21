import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import VideoCallRoundedIcon from '@material-ui/icons/VideoCallRounded';


const buttonWrapperStyles = {
  position: 'relative',
  zIndex: 1,
  top: '35%',
  padding: '1.2rem'
}

export class JoinRoom extends Component {
    constructor() {
        super();
        this.state = {
            joinId: ''
        }
    }
    render() {
        const { joinBtn } = this.props
        return (
            <div style={buttonWrapperStyles}>
                <Button 
                    variant='contained' 
                    color='primary' 
                    style={{  fontSize: '1.5rem' }}
                    onClick={ joinBtn }
                    onSubmit={(e) => this.setState({ joinId: e.target.value })}
                    onChange={ this.joinButton }
                >
                Join<VideoCallRoundedIcon fontSize='inherit' />
                </Button>
            </div>
        )
    }

    joinButton = () => {
        console.log(this.state.joinId) 
    }
}

export default JoinRoom
