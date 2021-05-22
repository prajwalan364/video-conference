import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

import { AppBar, Typography } from '@material-ui/core';

import './App.css';

const SOCKET_URL = 'http://127.0.0.1:8000';

let myStream, peer;
let peers = [];
let roomId;
// let socket = io(SOCKET_URL);

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(SOCKET_URL);
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
      this.socket.emit('join-room', roomId, id);
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
        this.handleAnswerCall(stream);
      })
      .catch((error) => {
        console.error(error);
      });

    this.socket.on('user-disconnected', (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    setInterval(this.handleReceiveMessage(), 100);
  }

  handleAnswerCall = (stream) => {
    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        this.handleAddVideoStream(video, userVideoStream);
      });
    });
  };

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
    this.socket.on('user-connected', (userId) => {
      console.log(userId);
      console.log('hello');
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

          call.on('close', () => {
            video.remove();
          });

          peers[userId] = call;
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  // Handlining Mute And Unmute
  handleMuteUnmute = () => {
    const enabled = myStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      this.setState({ muted: true });
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      this.setState({ muted: false });
    }
  };

  // Handling video off and one
  handlePlayStopVideo = () => {
    const enabled = myStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      this.setState({ hideVideo: true });
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      this.setState({ hideVideo: false });
    }
  };

  //MESSAGE PART
  handleReceiveMessage = () => {
    this.socket.on('createMessage', (message) => {
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
    this.socket.emit('message', { message: message, userId: peer.id });
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
                <div id="stopVideo" className="options-button">
                  <i className="fa fa-video"></i>
                </div>
                <div id="muteButton" className="options-button">
                  <i className="fa fa-microphone"></i>
                </div>
                <div id="showChat" className="options-button">
                  <i className="fa fa-comment"></i>
                </div>
              </div>
              <div className="options-right">
                <div id="inviteButton" className="options-button">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="leave-meet">
                  <button>Leave Meeting</button>
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

// const Video = () => {
//   const [messages, setMessages] = useState([]);
//   const [muted, setMuted] = useState(false);
//   const [hideVideo, setHideVideo] = useState(false);

//   useEffect(() => {
//     peer = new Peer(undefined, {
//       path: '/peerjs',
//       host: '/',
//       port: 8000,
//     });
//   }, []);

//   return (
//     <>
//       <AppBar position="static">
//         <Typography align="center" variant="h5" style={{ padding: '1rem' }}>
//           VIDEO CONFERNECE
//         </Typography>
//       </AppBar>

//       <div className="show-case">
//         <div className="main-left">
//           <div className="videos-grp">
//             <div id="video-grid"></div>
//           </div>

//           <div className="options">
//             <div className="options-left">
//               <div id="stopVideo" className="options-button">
//                 <i className="fa fa-video"></i>
//               </div>
//               <div id="muteButton" className="options-button">
//                 <i className="fa fa-microphone"></i>
//               </div>
//               <div id="showChat" className="options-button">
//                 <i className="fa fa-comment"></i>
//               </div>
//             </div>
//             <div className="options-right">
//               <div id="inviteButton" className="options-button">
//                 <i className="fas fa-user-plus"></i>
//               </div>
//               <div className="leave-meet">
//                 <button>Leave Meeting</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="main-right">
//           <div className="main-chat-window">
//             <div className="messages">
//               {messages.map((msg, idx) => (
//                 <div key={idx} className="msg chat">
//                   <p key={idx}>{msg}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <form onSubmit={this.handleSendMessage}>
//             <div className="main-message-container">
//               <input
//                 id="chat-message"
//                 type="text"
//                 onChange={this.handleMessage}
//                 autoComplete="off"
//                 placeholder="Type message here..."
//               />

//               <button type="submit" id="send" className="options-button">
//                 <i className="fab fa-telegram-plane"></i>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

export default Video;
