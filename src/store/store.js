import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)




const store = new Vuex.Store({
    state:{
        popupState1:false,  
        popupState2:false, 
        showChatRoom:true,
        newMsgArr:[],//聊天 监听到新消息
        newMsgNum:0,//用户 聊天页面  监听是否有新消息
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