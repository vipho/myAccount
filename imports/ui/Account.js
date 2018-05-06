import React, { Component } from 'react';

import { Accounts } from '../api/accounts.js';

export default class Account extends Component {
    removeAccount() {
        const _id = this.props.account._id;

        Meteor.call('accounts.remove', _id);
    }

    render() {
        return (
            <tr>
                {this.props.fields.map(item => <td className="align-middle" key={item}>{this.props.account[item]}</td>)}

                <td className="align-middle">
                    <button type="button" className="btn btn-light" onClick={this.removeAccount.bind(this)}>&times;</button>
                </td>
            </tr>
        )
    }
}