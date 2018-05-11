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

    if (Meteor.users.find().count() === 0) {
        Meteor.users.insert({
            services: {
                u2f: {
                    publicKey: "BLBM0ZZKn9CCpKX-MEGIQBJ_njfqsCRDIgkTvFouXTvwjfGAX0J6TR8PCwdzrGCQcJAuZ6-BBklUGrdAKxsnKxA",
                    keyHandle: "SK3_MlObCmBx9pPJbE4ZO4qZvrB433bagEI4XoZsZY57hm_Wvtz2-_RmH3mrbOekxJ0beZ4-aq9LNU28hLjTi694CQcFkWc0VbL_GUhZwQArlVfjcCC0Ef_ad081w9rq",
                },
            },
            username: 'vipho',
        });
    }
});