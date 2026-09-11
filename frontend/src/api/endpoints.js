

const endPoints={
    LOGIN:{
        url:'/auth/login',
        auth:false
    },
    REGISTER:{
        url:'/auth/register',
        auth:false
    },
    LOGOUT:{
        url:'/auth/logout',
        auth:false
    },
    CreateWorkspace:{
        url:'/workspace/create',
        auth:true
    },
    CreateInvite:{
        url:'/workspace/invite',
        auth:true
    },
    AcceptInvite:{
        url:'/workspace/invite/:token/accept',
        auth:true
    },
    Dashboard:{
        url:'/dashboard',
        auth:true
    },
    Board:{
        url:'/board',
        auth:true
    },
    CreateBoard:{
        url:'/board/:workspaceId',
        auth:true
    },
    CreateTask:{
        url:'/task/:boardId',
        auth:true
    }
}

export default endPoints;