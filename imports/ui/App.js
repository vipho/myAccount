import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { AccountsMongo } from '../api/accounts.js';

import Account from './Account.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'u2f-api-polyfill/u2f-api-polyfill.js';

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

        let obj = {};

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
        if (! this.props.user) {
            Meteor.call('u2f.authenticationChallengeHandler', (error, result) => {
                if (error) {
                    return 'Пиздец, ' + error;
                }

                let req = result.req;

                if (result.isRegistered) {
                    try {
                        window.u2f.sign(req.appId, [req.challenge], [req], (res) => {
                            Accounts.callLoginMethod({
                                methodArguments: [{
                                    u2f: true,
                                    res,
                                    req,
                                }],
                            });
                        });
                    } catch (e) {
                        console.log(e);
                        alert('Этот браузер не поддерживается. Какая жалость! :(');
                    }
                } else {
                    try {
                        window.u2f.register(req.appId, [req], [], (res) => {
                            Meteor.call('u2f.registrationVerificationHandler', req, res);
                        });
                    } catch (e) {
                        console.log(e);
                        alert('Этот браузер не поддерживается. Какая жалость! :(')
                    }
                }
            });

            return (
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">You are not authenticated</h1>
                        <p className="lead">Insert your Security Key and activate it.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid">

                <div className="row">
                    <div className="col">
                        <h2 className="py-3">myAccount <button type="button" className="btn btn-light align-right" onClick={() => {Meteor.logout();}}>(Log out)</button></h2>

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
    Meteor.subscribe('accounts');

    return {
        accounts: AccountsMongo.find({}, { sort: { Url: 1 } }).fetch(),
        user: Meteor.userId(),
    };
})(App);