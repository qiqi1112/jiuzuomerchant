<template>
    <div id="service">
        <div class="box">
            <div class="people_list">
                <ul>
                    <li>张三</li>
                    <li>李四</li>
                    <li>老吴</li>
                </ul>
            </div>
            <div class="chat"></div>
            <div class="quick"></div>
        </div> 
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        methods: {
            
        },
        computed: {
            
        }
    }

</script>

<style scoped lang='less'>
#service{
    .box{
        width: 80%;
        min-width: 1100px;
        height: 700px;
        display: flex;
        background: white;
        .people_list{
            flex: .2;
            li{
                height: 50px;
                line-height: 50px;
            }
        }
        .chat{
            flex:.6;
            background: rgb(43, 220, 226);
        }
        .quick{
            flex: .2;
            background: rgb(241, 188, 12);
        }
    }
}
</style>

