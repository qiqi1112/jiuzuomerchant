<template>
    <div id="app" @click="close">
        <router-view></router-view>
    </div>
</template>
<script>
export default{
    data(){
        return{

        }
    },
    created(){

    },
    methods:{
        close(){
            this.$store.commit('change',2)
        }
    }
}


</script>
<style lang='less'>
    @import './assets/css/normalize.css';
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /* 深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
@def-color:#000;
@line-bg-color:rgb(138, 143, 134);
    // 公用
.column{
    display: flex;
    margin: 20px 0;
}
.line{
    width: 5px;
    background: @line-bg-color;
    margin-right: 10px;
    display: inline-block;
}
.lw1{
    height: 30px;

}
.lw2{
    height: 20px;
    
}
</style>