<template>
    <div id="app" @click="close">
        <chatRoom></chatRoom>
        <router-view></router-view>
    </div>
</template>
<script>
import chatRoom from './components/common/ChatRoom';
export default {
    data() {
        return {};
    },
    created() {},
    components: {
        chatRoom
    },
    methods: {
        close() {
            this.$store.commit('change', 2);
        }
    }
};
</script>
<style lang='less'>
@import './assets/css/normalize.css';
@import './assets/css/main.css';
@import './assets/css/color-dark.css'; /* 深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
@def-color: #000;
@line-bg-color: #8a8f86;
// 公用
.column {
    display: flex;
    margin: 20px 0;
}
.line {
    width: 5px;
    background: @line-bg-color;
    margin-right: 10px;
    display: inline-block;
}
.lw1 {
    height: 30px;
}
.lw2 {
    height: 20px;
}
.text_over {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>