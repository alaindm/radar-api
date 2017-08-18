import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import * as actions from '../../../actions';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
// import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '600px',
    overflowY: 'auto'
  }
};

class Grid extends Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    return (
        <div style={styles.root} >
            <GridList
            cellHeight={180}                       
            >
            {/*(this.props.pics.length > 0) &&*/ this.props.pics.map((item) => (
                <GridTile
                    onClick={ () => this.props.history.push(`/post/${item.code}`) }
                    style={ {'cursor': 'pointer'} }
                    key={item.date}
                    title={item.name}
                    subtitle={<span>When:<b>{moment(item.date*1000).fromNow()}</b></span>}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>}>
                <   img src={item.thumbnail_src} alt="from post" />
                </GridTile>
            ))}
            </GridList>
        </div>
    )
  }
}

const mapStateToProps = state => {
  return { 
    pics: state.insta.pics
   }
}

export default withRouter(connect(mapStateToProps, actions)(Grid))
