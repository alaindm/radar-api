import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Card, CardTitle} from 'material-ui/Card';
import TabsWithContent from './shared/TabsWithContent'
import * as actions from '../../actions';

class Tag extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getTagInfo(id)
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.match.params !== nextProps.match.params) {
      const { id } = nextProps.match.params;
      this.props.getTagInfo(id)
    }    
  }

  render() {
    const tagHeader = () => {
      return (
        <Card>
          <CardTitle title={`#${this.props.tagData.name}`} />
        </Card>
      )
    }

    if(this.props.tagData) {
      return (
        <TabsWithContent header={tagHeader} />
      )
    } else {
      return <div></div>
    }

  }
}

function mapStateToProps(state) {
  return { 
    tagData: state.insta.tagData
   };
}

export default connect(mapStateToProps, actions)(Tag);


