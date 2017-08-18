import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {List, ListItem} from 'material-ui/List';
// import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionInfo from 'material-ui/svg-icons/action/info';
import * as actions from '../../../actions';
// import {grey400} from 'material-ui/styles/colors';
// import IconButton from 'material-ui/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
/*import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);*/

/*const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);*/



class Comments extends Component {
    commentItem = ({node}) => {
        return (
            <div key={node.id}>
                <ListItem            
                    leftAvatar={<Avatar src={node.owner.profile_pic_url} onClick={ () => this.props.history.push(`/user/${node.owner.username}`) } style={ {'cursor': 'pointer'} } />}
                    rightIcon={<ActionInfo />}
                    primaryText={<div onClick={ () => this.props.history.push(`/user/${node.owner.username}`) } style={ {'cursor': 'pointer'} } >{node.owner.username}</div>}
                    secondaryText={
                        <p><strong>{moment(node.created_at * 1000).format('MMMM D, YYYY @ h:mm a')}</strong>
                            {` - ${node.text}`}
                        </p>
                    }
                    secondaryTextLines={2}
                />
            </div>
        )
    }

    render() {
        return (
            <div>
                <List>
                    <Subheader>{`${this.props.comments.count} Comments`}</Subheader>
                </List>
                {this.props.comments.edges.map(this.commentItem)}
            </div>
        )
    }
} 

export default withRouter(connect(null, actions)(Comments))
