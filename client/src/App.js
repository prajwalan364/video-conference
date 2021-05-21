import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Modal from './components/Modal';
import LanguageIcon from '@material-ui/icons/Language';
import './App.css';
import {ThemeProvider} from '@material-ui/styles';

/*
? custom css [ for Reference ]
  const styles = ( ) => ({
    btn: {
      backgroundColor: 'red',
       fontSize: '30',
      '&:hover': {
      backgroundColor: 'black'
        }
    },
      text: {
      }
  })

  const otherContentStyles = {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'red',
    padding: '10px'
  }
*/

export class App extends Component {
  constructor() {
    super();
    this.state = {
      newButton: false,
      joinButton: false
    }
  }

  newButtonHandle = () => {
  this.setState({ newButton: true })
}

  closeNewButton = () => {
  this.setState({ newButton: false})
}

joinButtonHandle = () => {
  prompt(`Copy this link and send it to people you want to meet with`, window.location.href)
}
  render() {
    return (
      <>
        <Container align='center' style={{height: '100vh'}}>
          <Typography 
              variant="h2" 
              gutterBottom align='center'
              color='textSecondary'
              className='header-content'
            >
          Video Conference App
          < LanguageIcon  fontSize='large'/>
          </Typography>
        <CreateRoom  newBtn={this.newButtonHandle} />
        <Modal  open={this.state.newButton} onClose={this.closeNewButton} />
        <JoinRoom joinBtn={this.joinButtonHandle} />
        </Container>
      </>
    )
  }
}

export default (App);

