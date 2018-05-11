import { Meteor } from 'meteor/meteor';

import u2f from "u2f";
const APP_ID = 'https://pc.alamp.ru';

Meteor.methods({
    // 'u2f.registrationVerificationHandler'(req, res) {
    //     const result = u2f.checkRegistration(req, res);
    //     console.log(result);
    // },

    'u2f.authenticationChallengeHandler'(username) {
        const user = Meteor.users.findOne({ username });
        const keyHandle = user.services.u2f.keyHandle;

        return u2f.request(APP_ID, keyHandle);
    },
    // 'u2f.authenticationVerificationHandler'(req, res, username) {
    //     const user = Meteor.users.findOne({ username });
    //     const publicKey = user.publicKey;
    //
    //     const result = u2f.checkSignature(req, res, publicKey);
    //     return result;
    // },
});

Accounts.registerLoginHandler('u2f', function (options) {
    if (!options.u2f) return;

    const user = Meteor.users.findOne({ username: options.username });
    const publicKey = user.services.u2f.publicKey;

    let result = u2f.checkSignature(options.req, options.res, publicKey);

    if (result.successful) {
        return { userId: user._id };
    }
});