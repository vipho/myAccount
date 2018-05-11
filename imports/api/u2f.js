import { Meteor } from 'meteor/meteor';

import u2f from "u2f";
const APP_ID = 'https://pc.alamp.ru';

Meteor.methods({
    'u2f.registrationVerificationHandler'(req, res) {
        const user = Meteor.users.findOne({ username: 'adm' });

        if (user) {
            console.log('fake reg');
            return undefined;
        }
        console.log('reg');

        const result = u2f.checkRegistration(req, res);
        const publicKey = result.publicKey;
        const keyHandle = result.keyHandle;

        Meteor.users.insert({
            services: {
                u2f: {
                    publicKey,
                    keyHandle,
                },
            },
            username: 'adm',
        });
    },

    'u2f.authenticationChallengeHandler'() {
        const user = Meteor.users.findOne({ username: 'adm' });

        if(! user) {
            console.log('is not reg');
            return {
                isRegistered: false,
                req: u2f.request(APP_ID),
            };
        }

        const keyHandle = user.services.u2f.keyHandle;

        console.log('auth');
        return {
            isRegistered: true,
            req: u2f.request(APP_ID, keyHandle),
        };
    },
});

Accounts.registerLoginHandler('u2f', function (options) {
    if (!options.u2f) return undefined;

    const user = Meteor.users.findOne({ username: 'adm' });
    const publicKey = user.services.u2f.publicKey;

    let result = u2f.checkSignature(options.req, options.res, publicKey);

    if (result.successful) {
        return { userId: user._id };
    }
});