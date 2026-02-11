const ROUTES = {
    SOCKET_URL :'http://localhost:3333',

    AUTH:{
        LOGIN:'/auth/login'
    },

    EVENTS: {
        GET:'/events/get',
        CREATE_BATCH:'/events/create-batch',
        CREATE_EVENT:"/events/create"
    },
    USERS:{
        GET_PATIENTS:"/users/patients",
        GET_DOCTORS:"/users/doctors"
    },

}

export default ROUTES;