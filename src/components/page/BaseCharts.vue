<template>
    <div id="mapShow">
        <mapBox :mapList="mapList" @child-data="mapData"></mapBox>
    </div>

</template>
<script>
import map from '../common/map'
export default{
    name: 'mapShow',
    data(){
        return{
            mapList:{
                longitude:104.10194,//经度
                latitude:30.65984,//纬度
                address:'',//默认输入框
                seacth_city:'成都',//默认城市
                width:'400px',
                height:'400px'
            }
        }
    },
    components: {
        mapBox:map
    },
    created(){
    },
    methods:{
        mapData(val){
            console.log(val)
        }
    }
}
</script>  
<style scoped lang='less'>
#mapShow{
    height: 100%;
}
</style>