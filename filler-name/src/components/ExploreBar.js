import React from 'react';
import {
	API,
	createHeader
} from '../constants';


class ExploreBar extends React.Component {
	constructor(props){
		super(props);
		this.state = {value: ''};


		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);

	}

	handleChange(event){
		this.setState({value: event.target.value});
	}


	async handleSearch(event) {
		event.preventDefault();
		const { data } = await API.post('/explore', {
			keyword: this.state.value
		}, createHeader(window.localStorage.getItem('jwt')));
		this.props.displayResult(data, true);
	}

  render(){
    return(
     <form onSubmit =
      {this.handleSearch}>
      <label>
        Search:
	<input type="text" value = {this.state.value} onChange=
	  {this.handleChange} />
      </label>
      <input type="submit"
	value="Search" />
     </form>
    );
  }
}

export default ExploreBar;
