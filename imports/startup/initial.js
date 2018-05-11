Meteor.startup(() => {
    Accounts.validateLoginAttempt(attempt => {
        // console.log(attempt);
        if (
            ( attempt.type === 'u2f' || attempt.type === 'resume' ) &&
            attempt.methodName === 'login'
        ) {
            return attempt.allowed;
        }

        return false;
    });
});