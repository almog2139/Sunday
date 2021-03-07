
import { Component } from 'react'
import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';


export class BoardSearch extends Component {


    state = {
        txt: ''
    }
//function get the input event take the value search board title by the value 
    handelChange = (ev) => {
        console.log('search');
        const { value } = ev.target
        this.setState({ txt: value }, () => this.props.onSetFilter(this.state.txt));
    };

    render() {
        return <>
            <section className="search-field">
                <SearchIcon />
                <input id="standard-basic" label="Search" name="txt" value={this.state.txt}
                    onChange={this.handelChange} autoComplete="off" placeholder="Search" />
            </section>
            <div></div>
        </>
    }


}