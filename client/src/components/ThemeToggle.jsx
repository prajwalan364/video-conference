import React, { Component } from 'react'
import {  Switch, Paper } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import '../App.css'
import { light } from '@material-ui/core/styles/createPalette'

// const darkMode = createMuiTheme({
//     palette: {
//         type: 'dark',
//     }
// })

// const lightMode = createMuiTheme({})

export class ThemeToggle extends Component {
    constructor() {
        super();
        this.state ={
            dark: false
        }
    }

    render() {
            const theme = createMuiTheme({
                palette: {
                type: this.state.dark ? 'dark' : 'light'
                    }
            })
        const { children } = this.props
        return (
            <>
            <ThemeProvider theme={theme}>
            <Paper style={{height: '100vh'}}>
            { children }
            <Switch checked={this.state.dark} onChange={this.darkModeHandler} />
            </Paper>
            </ThemeProvider>
            {/* <div style={ this.state.dark ? darkMode : lightMode}>
                <span style={{ color: this.state.dark ? "grey" : "yellow"}}>☀</span>
                <div className="switch-checkbox">
                    <label className="switch">
                        <input type="checkbox" onChange={this.changeTheme} />
                        <span className="slider round"> </span>
                    </label>
                </div>
                <span style={{ color: this.state.dark ? "#c96dfd" : "grey"}}>🌙</span>
            </div> */}

            </>
        )
    }
    darkModeHandler = () => {
        this.setState({ dark: !this.state.dark})
    }
}

export default ThemeToggle
