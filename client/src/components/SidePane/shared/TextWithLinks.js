import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as actions from '../../../actions';

const userRegex = /@\w.?/
const hashtagRegex = /#\w.?/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class TextWithlinks extends Component {
    hashtagTest = string => {
        if(string.lenght > 50) {
            return (
                string
            )
        } else {
            if(hashtagRegex.test(string)) {
                let hashArray = string.split("#")
                if (hashArray.length > 2) {
                    let key = 0            
                    let hashArrayWithLinks = hashArray.map(tag => {
                        let tagWithHash = '#' + tag
                        key++
                        return (
                            <a key={key} onClick={() => this.props.history.push(`/tag/${tag}`)} style={{'cursor': 'pointer'}}>{tagWithHash}</a>
                        )
                    })            
                    return (
                            hashArrayWithLinks.map(reactObject => {
                                return (
                                    reactObject
                                )
                            })
                    )
                } else {
                    let stringWithoutHash = string.slice(1)
                    return (
                        <a onClick={() => this.props.history.push(`/tag/${stringWithoutHash}`)} style={{'cursor': 'pointer'}}>{string}</a>
                    )
                }        
            } else {
                return (
                    string
                )
            }
        }        
    }

    userTest = string => {
        if(string.lenght > 40) {
            return (
                string
            )
        } else {
            if(emailRegex.test(string)) {
                return (
                    string
                )
            } else {
                if(userRegex.test(string)) {
                    let stringWithoutAt = string.slice(1)
                    return (
                        <a onClick={() => this.props.history.push(`/user/${stringWithoutAt}`)} style={{'cursor': 'pointer'}}>{string}</a>
                    )
                } else {
                    return (
                        string
                    )
                }
            }            
        }
    }

    regexTest = string => {
        return (
                // &nbsp;
                hashtagRegex.test(string) ? this.hashtagTest(string) : this.userTest(string)
        )        
    }

    // createMarkup = (text) => {
    //     let members = text.split(' ')
    //     let withTags = members.map(this.regexTest)
    //     let key = 0   
    //     return (
    //             withTags.map(x => {
    //                 key++
    //                 return (
    //                     // <span key={key}>{x}&nbsp;</span>
    //                     x
    //                 )
    //             })
    //     )
    // }

    render () { 
        if(this.props.text){
            let text = this.props.text
            let members = text.split(' ')
            let withTags = members.map(this.regexTest)
            let key = 0
            return (
                <div>
                    {
                        withTags.map(x => {
                            key++
                            return (
                                <span key={key} style={{lineHeight: '1.8', wordWrap: 'normal', 'display': 'inline-block'}}>{x}&nbsp;</span>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div style={{whiteSpace: 'pre'}}>
                </div>
            )
        }
    }    
}

export default withRouter(connect(null, actions)(TextWithlinks))
