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
               
                width:'1200px',
                height:'600px',
                status:true,
                searchAddress: '光华公园',
                trustAddress: '132312'
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
            // console.log(val)
        }
    }
}
</script>  
<style scoped lang='less'>
#mapShow{
    height: 100%;
}
</style>