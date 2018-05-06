import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';

export const Accounts = new Mongo.Collection('myAccount');

if (Meteor.isServer) {
    Meteor.publish('accounts', () => {
        return Accounts.find();
    });
}
Meteor.methods({
    'accounts.insert'(props) {
        Object.assign(props, {
            createdAt: new Date(),
        });

        Accounts.insert(props);
    },
    'accounts.remove'(_id) {
        Accounts.remove(_id);
    },
})