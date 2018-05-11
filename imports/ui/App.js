import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { AccountsMongo } from '../api/accounts.js';

import Account from './Account.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'u2f-api-polyfill/u2f-api-polyfill.js';

/// Registration

// import u2f from 'u2f';
//
// const APP_ID = 'https://pc.alamp.ru';
// const registrationRequest = u2f.request(APP_ID);
// console.log(registrationRequest);
// try {
//     window.u2f.register(registrationRequest.appId, [registrationRequest], [], (registrationResponse) => {
//         // Send this registration response to the registration verification server endpoint
//         console.log(registrationResponse);
//         Meteor.call('u2f.registrationVerificationHandler', registrationRequest, registrationResponse);
//     });
// } catch (e) {
//     alert('Этот браузер не поддерживается. Какая жалость! :(')
// }


///

if ( Meteor.userId() ) {
    console.log('АВТОРИЗОВАН');
} else {
    const username = 'vipho';
    Meteor.call('u2f.authenticationChallengeHandler', 'vipho', (error, req) => {
        if (error) {
            return 'Пиздец, ' + error;
        }

        try {
            window.u2f.sign(req.appId, [req.challenge], [req], (res) => {
                Accounts.callLoginMethod({
                    methodArguments: [{
                        u2f: true,
                        res,
                        username,
                        req,
                    }],
                });
            });
        } catch (e) {
            console.log(e);
            alert('Этот браузер не поддерживается. Какая жалость! :(');
        }
    });
}

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
    Meteor.subscribe('accounts');

    return {
        accounts: AccountsMongo.find({}, { sort: { Url: 1 } }).fetch(),
    };
})(App);