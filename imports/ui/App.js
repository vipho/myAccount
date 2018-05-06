import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Accounts } from '../api/accounts.js';

import Account from './Account.js';

import 'bootstrap/dist/css/bootstrap.css';

const fields = [
    'Url',
    'Nickname',
    'Mail',
    'Phone',
    'Password',
    'MFA',
];

class App extends Component {
    handleSubmit(event) {
        event.preventDefault();

        let obj = new Object();

        fields.forEach(item => {
            obj[item] = ReactDOM.findDOMNode(this.refs[item]).value.trim();
        });

        Meteor.call('accounts.insert', obj);

        fields.forEach(item => {
            ReactDOM.findDOMNode(this.refs[item]).value      = '';
        });
    }

    renderAccounts() {
        return this.props.accounts.map((account) => (
            <Account key={account._id} account={account} fields={fields} />
        ))
    }

    render() {
        return (
            <div className="container-fluid">

                <div className="row">
                    <div className="col">
                        <h2 className="py-3">myAccount</h2>

                        <table className="table">
                            <thead>
                            <tr>
                                {fields.map(item => <th scope="col" key={item}>{item}</th>)}
                                <th>{/*Times*/}</th>
                            </tr>
                            </thead>
                            <tbody>

                                {this.renderAccounts()}

                            </tbody>
                        </table>
                    </div>
                    <div className="col col-lg-2">
                        <h2 className="py-3">ADD</h2>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            {fields.map(item =>
                                <div className="form-group" key={item}>
                                    <input type="text" className="form-control" ref={item} placeholder={item} />
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-block">Submit</button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('accounts')

    return {
        accounts: Accounts.find({}, { sort: { url: 1 } }).fetch(),
    };
})(App);