import React from 'react';
import {withRouter} from 'react-router-dom'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import BackArrow from 'material-ui/svg-icons/hardware/keyboard-backspace';

const style = {
  margin: 10,
  verticalAlign: 'middle'
};

const BackButton = props => (
    <div style={{display: 'inline-block'}} >
        <FloatingActionButton style={style} onTouchTap={() => props.history.goBack()}>
            <BackArrow />
        </FloatingActionButton>
        <span 
            style={{
                fontSize: '18px',
                display: 'inline-block',
                verticalAlign: 'middle'
            }}>
            Back
        </span>
    </div>
);

export default withRouter(BackButton)