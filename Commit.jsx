import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Progress} from 'thousanday-react';

class Commit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commits: [],
            total: 0,
            percentage: "true",
            name: ""
        };
    }
    showPunch () {
        let xmlhttp = new XMLHttpRequest();  
        xmlhttp.open("GET", "https://api.github.com/users/" + this.state.name + "/repos", false);  
        xmlhttp.send();  
        let result = JSON.parse(xmlhttp.responseText);
        let repos = [];
        for (let i = 0; i < result.length; i++) {
            repos[i] = result[i].full_name;
        }
        let punch = [];
        for (let j = 0; j < repos.length; j++) {
            xmlhttp = new XMLHttpRequest();  
            xmlhttp.open("GET", "https://api.github.com/repos/" + repos[j] + "/stats/punch_card", false);
            xmlhttp.send();
            punch[j] = JSON.parse(xmlhttp.responseText);
        }
        let commits = [];
        let total = 0;
        for (let k = 0; k < punch.length; k++) {
            for (let l = 0; l < punch[k].length; l++) {
                commits[punch[k][l][1]] = (commits[punch[k][l][1]] || 0) + punch[k][l][2];
                total += punch[k][l][2];
            }
        }
        this.setState({commits: commits});
        this.setState({total: total});
    }
    changeFormat() {
        if (this.state.percentage === "true") {
            this.setState({percentage: "false"});
        } else {
            this.setState({percentage: "true"});
        }
    }
    inputName(event) {
        this.setState({name: event.target.value});
    }
	render() {
        let lineStyle = {
            display: "inline-block",
            width: "100%"
        };
        let indexStyle = {
            display: "inline-block",
            fontSize: "12px",
            width: "10%"
        };
        let buttonStyle = {
            display:"inline-block",
            marginRight: "2%",
            marginBottom: "20px"
        };
        let nameStyle = {
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "bold",
            marginRight: "2%",
        };
        let format;
        if (this.state.percentage === "true") {
            format = "Percentage";
        } else {
            format = "Value";
        }
        let perhours = this.state.commits.map((perhour, index) =>
            <div key={index} style={lineStyle}>
                <div style={indexStyle}>{index}:00 - {index}:59</div>
                <Progress progress={perhour} max={this.state.total} percentage={this.state.percentage} height="12px" width="80%" />
            </div>
        );
		return (
			<main>
                <div style={nameStyle}>Your Github users name:</div>
                <input style={buttonStyle} type="text" onChange={this.inputName.bind(this)} />
				<input style={buttonStyle} type="button" value="show" onClick={this.showPunch.bind(this)} />
                <input style={buttonStyle} type="button" value={format} onClick={this.changeFormat.bind(this)} />
                {perhours}
			</main>
		);
	}
}
ReactDOM.render(<Commit />, document.getElementById('root'));