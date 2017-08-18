import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs';
import Loading from './Loading'
import Error from '../Error'
import PicsList from './PicsList'
import GridList from './GridList'
import * as actions from '../../../actions';
import './contentTab.css'

class User extends Component {
  handleTab = value => {
    this.props.setTab(value)
  };

  render() {
    // this.props.loading && <Loading />
    // this.props.error && <Error />
    if(this.props.loading) {
      return (
        <Loading />
      )
    }

    if(this.props.error) {
      return (
        <Error />
      )
    }

    return (
      <Tabs
        value={this.props.tab}
        onChange={this.handleTab}
        >
        <Tab label="Timeline" value="timeline">
          <div className="scroll">
            {this.props.header()}
            <PicsList />
          </div>
        </Tab>
        <Tab label="Mosaic" value="mosaic">          
          <div className="scroll">
            {this.props.header()}
            <GridList />
          </div>
        </Tab>
      </Tabs>
    )
     
  }
}

function mapStateToProps(state) {
  return { 
    tab: state.insta.tab,
    error: state.insta.error,
    loading: state.insta.loading
   };
}

export default connect(mapStateToProps, actions)(User)


