const ROUTES = {
    SOCKET_URL :'http://localhost:3333',

    AUTH:{
        LOGIN:'/api/auth/login',
        ME:'/api/auth/me',
    },

    EVENTS: {
        GET:'/api/events/get',
        CREATE_BATCH:'/api/events/create-batch',
        CREATE_EVENT:"/api/events/create"
    },
    USERS:{
        GET_PATIENTS:"/api/users/patients",
        GET_DOCTORS:"/api/users/doctors"
    },

}

export default ROUTES;