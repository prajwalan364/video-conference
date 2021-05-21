import React from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

import { AppBar, Typography } from '@material-ui/core';

import './App.css';

const SOCKET_URL = 'http://127.0.0.1:8000';
let socket = io(SOCKET_URL);
let myStream, peer;

let roomId;
class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      message: '',
      messages: [],
      muted: false,
      hideVideo: false,
    };
    roomId = this.props.match.params.url;
  }
  //messageContainer = React.createRef();

  componentDidMount() {
    peer = new Peer(undefined, {
      path: '/peerjs',
      host: '/',
      port: 8000,
    });

    peer.on('open', (id) => {
      socket.emit('join-room', roomId, id, 'Prajwalan');
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        //audio: true,
      })
      .then((stream) => {
        myStream = stream;
        const myVideo = document.createElement('video');
        this.handleAddVideoStream(myVideo, myStream);
      })
      .catch((error) => {
        console.error(error);
      });

    setInterval(this.handleReceiveMessage(), 100);
  }

  handleAddVideoStream = (video, stream) => {
    const videoGrid = document.getElementById('video-grid');
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
      video.play();
      video.muted = true; // muted for testing purposes
    });
    videoGrid.append(video);
  };

  handleNewUserJoin = () => {
    socket.on('user-connected', (userId) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          //audio: true,
        })
        .then((stream) => {
          const call = peer.call(userId, stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            this.handleAddVideoStream(video, userVideoStream);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  handleReceiveMessage = () => {
    socket.on('createMessage', (message) => {
      const { messages } = this.state;
      messages.push(message);
      this.setState({ messages });
      // this.scrollToBottom();
    });
  };

  handleMessage = (event) => {
    this.setState({ message: event.target.value });
  };

  handleSendMessage = (event) => {
    event.preventDefault();
    const { message } = this.state;
    socket.emit('message', { message: message, userId: peer.id });
    this.setState({ message: '' });
    event.target.reset();
  };

  render() {
    this.handleNewUserJoin();
    const { messages } = this.state;
    return (
      <>
        <AppBar position="static">
          <Typography align="center" variant="h5" style={{ padding: '1rem' }}>
            VIDEO CONFERNECE
          </Typography>
        </AppBar>

        <div className="show-case">
          <div className="main-left">
            <div className="videos-grp">
              <div id="video-grid"></div>
            </div>

            <div className="options">
              <div className="options-left">
                <div id="stopVideo" className="options__button">
                  <i className="fa fa-video-camera"></i>
                </div>
                <div id="muteButton" className="options__button">
                  <i className="fa fa-microphone"></i>
                </div>
                <div id="showChat" className="options__button">
                  <i className="fa fa-comment"></i>
                </div>
              </div>
              <div className="options__right">
                <div id="inviteButton" className="options__button">
                  <i className="fas fa-user-plus"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="main-right">
            <div className="main-chat-window">
              <div className="messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className="msg chat">
                    <p key={idx}>{msg}</p>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={this.handleSendMessage}>
              <div className="main-message-container">
                <input
                  id="chat-message"
                  type="text"
                  onChange={this.handleMessage}
                  autoComplete="off"
                  placeholder="Type message here..."
                />
                <button type="submit" id="send" className="options-button">
                  <i className="fab fa-telegram-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Video;
