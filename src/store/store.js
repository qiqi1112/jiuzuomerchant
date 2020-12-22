import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)




const store = new Vuex.Store({
    state:{
        popupState1:false,  
        popupState2:false, 
        showChatRoom:false,
        newMsgArr:[],//聊天 监听到新消息
        newMsgNum:0,//用户 聊天页面  监听是否有新消息
        headerUnread:0,//头部  未读消息
        headerClickMsg:false,//顶部点击消息  弹出 聊天页
        headerClickMute:false,//是否静音
        onloadOrder:false,//是否从 消息记录中点进 订单页
    },
    getters:{

    },
    mutations:{
        change(state,type){
            if(type == 2){
                state.popupState1 = false
                state.popupState2 = false
            }else if(type == 1){
                state.popupState2 = true
            }else if(type == 3){
                state.popupState1 = true
            }
        },
        showChat(state,val){
            state.showChatRoom = val
        },
        newMsg(state,val){
            state.newMsgArr.push(val)
        },
        newMsgState(state,num){
            state.newMsgNum = num
        },
        headerUnreadFun(state,num){
            state.headerUnread = num
        },
        headerClickMsgFun(state,type){
            state.headerClickMsg = type
        },
        headerClickMuteFun(state,type){
            state.headerClickMute = type
        },
        onloadOrderFun(state,type){
            state.onloadOrder = type
        },

    },
    // getters:{
    //     nameInfo(state){
    //         return state
    //     },
    //     fullInfo(state,getters){
    //         return state
    //     }  
    // },
    // actions:{
    //     aEdit(context,payload){
    //         return new Promise((resolve,reject)=>{
    //             setTimeout(()=>{
    //                 context.commit('edit',payload)
    //                 resolve()
    //             },2000)
    //         })
    //     }
    // },
    // models:{
    // }
})


export default store