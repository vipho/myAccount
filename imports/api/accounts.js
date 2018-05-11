import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';

export const AccountsMongo = new Mongo.Collection('myAccount');

if (Meteor.isServer) {
    Meteor.publish('accounts', function() {
        if (! this.userId)
            return;

        return AccountsMongo.find({});
    });
}
Meteor.methods({
    'accounts.insert'(props) {
        if (! this.userId)
            return;

        Object.assign(props, {
            createdAt: new Date(),
        });

        AccountsMongo.insert(props);
    },
    'accounts.remove'(_id) {
        if (! this.userId)
            return;

        AccountsMongo.remove(_id);
    },
});