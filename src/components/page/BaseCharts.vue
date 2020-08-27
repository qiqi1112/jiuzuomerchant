<template>
    <div id="map" @click.self='close'>
        <div class="seac_address">
            <el-input v-model="fristForm.address" placeholder="请输入地址" @blur="showFun(1)" @focus='showFun(2)'></el-input>
            <el-input v-model="fristForm.longitude" placeholder="经度" ></el-input>
            <el-input v-model="fristForm.latitude" placeholder="纬度" ></el-input>
            <div class="city">
                <span>{{value}}</span><span class="changeCity" @click="showCity=true">切换城市</span>
                <div class="cityList" v-if="showCity">
                    <span @click="changeCity(c)" v-for="(c,i) in city" :key="i">{{c.label}}</span>
                </div>
            </div>
            <ul class="add_list" v-if="showList">
                <div v-if="addressLists!=''">
                    <li @click="assignText(item)" v-for="(item,index) in addressLists" :key="index">
                        {{item.name}} 
                        <span>{{item.address}}</span>    
                    </li>
                </div>
                <div v-else class="notAdd">
                    没有相关地址~
                </div>
            </ul>
        </div>
        <div id="container" ref="container"></div>
    </div>
</template>

<script>
var searchService,geocoder,map,markersArray = [];
import city from '../../utils/city'
export default {
    data() {
        return {
            showList:false,
            showCity:false,
            fun:null,
            value1:'广东省深圳市大运地铁站',
            fristForm:{
                longitude:104.10194,//经度
                latitude:30.65984,//纬度
                address:''
            },
            markersArray:[],
            addressLists: [],
            city:[],
            value:'四川省',
        };
    },
    created(){
        console.log(city)
        this.city = city
        // city.forEach(c=>{
        //     city.push
        // })
    },
    mounted(){
        this.mapTX()
    },
 
    watch:{
        'fristForm.address': {
            handler: function(val) {
                this.debounce(this.changeStr,500);
            },
            deep: true
        },
    },
    methods:{
        // 关闭弹窗
        close(){
            this.showList = false
            this.showCity = false
        },
        // 展示搜索结果
        showFun(type){
            if(type == 1){
                // this.showList = false
                //离开
                // if(this.fristForm.address == ""){
                //     this.showList = true
                // }else{
                //     this.showList = false
                // }
            }else{
                this.showList = true
                // if(this.fristForm.address == ""){
                //     this.showList = false
                // }else{
                //     this.showList = true
                // }
            }
        },
        // 防抖
        debounce:function(fn,wait){
            if (this.fun!==null){
                clearTimeout(this.fun)
            }
            this.fun = setTimeout(fn,wait)
        },
        changeStr:function(data){
            searchService.search(this.fristForm.address);
            console.log(this.value)
            searchService.setLocation(this.value);
        },
        // 点击搜索结果赋值、
        assignText(val){
            this.fristForm.longitude = val.latLng.lat
            this.fristForm.latitude = val.latLng.lng
            this.fristForm.address = val.name
            this.showList = false
        },
        // 切换城市
        changeCity(val){
            this.value = val.label
        },
        searchKeyword() {
            this.clearOverlays()
            searchService.search(this.fristForm.address);
            
            return
            //根据输入的关键字在搜索范围内检索
            geocoder.getLocation(keyword);
                return
            console.log(keyword)
            if (keyword) {
                // searchService.search(keyword);
            } else {
                alert("请输入地址");
            }
        },
        getAddress(){
            // this.$post('/map/uri/v1/search?keyword=酒店&region=北京&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77').then(
            //     (res) => {
            //         console.log(res);
            //     },
            //     (err) => {
            //         console.log(err);
            //     }
            // );
            // var listener = qq.maps.event.addListener(
            //     map,
            //     'click',
            //     function() {
            //         alert('您点击了地图。');
            //     }
            // );
        },
        TMap() {
            return new Promise(function(resolve, reject) {
                window.init = function() {
                resolve(qq)
                }
                var script = document.createElement('script')
                script.type = 'text/javascript'
                script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=ABIBZ-Z7JR6-H7KSV-MXCVY-GS5RS-RJFNS'
                script.onerror = reject
                document.head.appendChild(script)
            })
        },
        mapTX() {
            let that = this
            this.TMap().then(qq => {
                var map = new qq.maps.Map(this.$refs.container, {   
                    //初始经纬度
                    center: new qq.maps.LatLng(30.611913633860105, 104.08172607421875),
                    zoom: 13
                })
                var scaleControl = new qq.maps.ScaleControl({
                    align: qq.maps.ALIGN.BOTTOM_LEFT,
                    margin: qq.maps.Size(85, 15),
                    map: map
                });
                //绑定单击事件添加参数
                qq.maps.event.addListener(map, 'click', function(event) {
                    that.fristForm.longitude = event.latLng.getLng(); // 经度
                    that.fristForm.latitude = event.latLng.getLat(); // 纬度

                    if (markersArray) {
                        for (let i in markersArray) {
                            markersArray[i].setMap(null);
                        }
                    }
                    var marker = new qq.maps.Marker({
                        map: map,
                        position: event.latLng
                    });
                    markersArray.push(marker);
                    // geocoder = new qq.maps.Geocoder({
                    //     complete: function(result) {
                    //     console.log(result,11111);
                    //     that.fristForm.longitude = result.detail.location.lng;
                    //     that.fristForm.latitude = result.detail.location.lat;
                    //     map.setCenter(result.detail.location);
                    //     var marker = new qq.maps.Marker({
                    //         map: map,
                    //         position: result.detail.location
                    //     });
                    //     markersArray.push(marker);
                    //     }
                    // });
                })
                geocoder = new qq.maps.Geocoder({
                    complete: function (result) {
                        console.log(result)
                        map.setCenter(result.detail.location);
                        var gps = result.detail.location.lat + ',' + result.detail.location.lng
                        var marker = new qq.maps.Marker({
                            map: map,
                            position: result.detail.location
                        });
                        that.markersArray.push(marker);
                        if (that.markersArray.length > 1) {
                            for(let i=0;i<that.markersArray.length-1;i++){
                                that.markersArray[i].setMap(null);//清除标记
                            }
                        }
                    }
                });


                searchService = new qq.maps.SearchService({
                    complete : function(results){
                        that.addressLists = results.detail.pois
                        console.log(that.addressLists)
                        if(results.type === "CITY_LIST") {
                            searchService.setLocation(results.detail.cities[0].cityName);
                            searchService.search(that.fristForm.address);
                            return;
                        }
                        var pois = results.detail.pois;
                        var latlngBounds = new qq.maps.LatLngBounds();
                        for(var i = 0,l = pois.length;i < l; i++){
                            var poi = pois[i];
                            latlngBounds.extend(poi.latLng);  
                            var marker = new qq.maps.Marker({
                                map:map,
                                position: poi.latLng
                            });

                            marker.setTitle(poi.name);
                        }
                        map.fitBounds(latlngBounds);
                    }
                });

                
            })
        },

        clearOverlays(){
            if (this.markersArray) {
                for (i in this.markersArray) {
                    this.markersArray[i].setMap(null);
                }
            }
        }


    },
};
</script>

<style scoped lang='less'>
#map{
    /deep/ .seac_address{
        width: 1100px;
        margin-bottom: 20px;
        position: relative;
        .add_list{
            font-size: 13px;
            width: 300px;
            background: #fff;
            list-style: none;
            padding: 10px 0 10px 0;
            position: absolute;
            z-index: 10;
            li{
                cursor: pointer;
                line-height: 30px;
                padding: 0 10px;
            }
            li:hover{
                background: rgb(209, 209, 209);
            }
            span{
                color: #888888;
            }
            .notAdd{
                text-align: center;
                color: #9c9c9c;
                padding: 10px 0;
            }
        }
        .city{
            font-size: 12px;
            position: relative;
            display: inline-block;
            .changeCity{
                color: red;
                cursor: pointer;
                margin-left: 10px;
            }
            .cityList{
                position: absolute;
                z-index: 10 ;
                background: white;
                padding: 10px;
                width: 200px;
                box-shadow: 0 2px 5px #5a5a5a;
                border-radius: 5px ;
                top: 25px;
                span{
                    margin-right: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    display: inline-block;
                    width: 25%;
                }
            }
        }
        
        .el-input--small{
            width: 300px;
            margin-right: 20px;
        }
    }
}
#container{
    width:1000px;
    height:600px;
    
}
// #pos-area {
//             background-color: #009DDC;
//             margin-bottom: 10px;
//             width: 100%;
//             overflow: scroll;
//             text-align: left;
//             color: white;
//         }
//         #demo {
//             padding: 8px;
//             font-size: small;
//         }
//        #btn-area {
//             height: 100px;
//         }
//         button {
//             margin-bottom: 10px;
//             padding: 12px 8px;
//             width: 42%;
//             border-radius: 8px;
//             background-color: #009DDC;
//             color: white;
//         }
</style>