const URL = __ENV.HOST_ENV;

const USER_NUMBER = [
    10,
    30,
    50,
    70,
    100
];

const VERIGENCHAT_ACTION = [
    {
        name: "Access login",
        step: [
            {
                method: 'GET',
                url: URL + '/sso/login',
                is_auth: false
            }
        ]
    },
    {
        name: "Access homepage",
        step: [
            {
                method: 'GET',
                url: URL + '/chat',
                is_auth: false
            },
            {
                method: 'POST',
                url: URL + '/sso/api/verify/token',
                is_auth: true
            },
            {
                method: 'GET',
                url: URL + '/sso/api/v2/info',
                is_auth: true
            },
            {
                method: 'GET',
                url: URL + '/sso/api/v3/menu',
                is_auth: true
            },
        ],
    },
    // {
    //     name: "Chat test",
    //     step: [

    //     ]
    // }
];

module.exports = {
    URL,
    USER_NUMBER,
    VERIGENCHAT_ACTION,
}
