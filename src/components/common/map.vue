<template>
    <div id="map">
        <div class="seac_address">
            <span @click.stop>
                <el-input v-model="fristForm.address" placeholder="请输入地址" @focus.stop="showFun(1)"></el-input>
                <el-button @click="defGet" icon="el-icon-search" circle style="position: relative;left: -52px;border:none"></el-button>
            </span>
            <!-- <el-input v-model="fristForm.longitude" placeholder="经度" ></el-input>
            <el-input v-model="fristForm.latitude" placeholder="纬度" ></el-input> -->
            <div class="city" @click.stop>
                <span>{{value}}</span>
                <span class="changeCity" @click.stop="showCityFun()">切换城市</span>
                <div class="cityList" v-if="showCity">
                    <div class="all" v-for="(c,i) in city" :key="i" style="display:flex">
                        <div class="province" style="flex:.3">
                            <span>{{c.label}}</span>
                        </div> 
                        <div class="city" style="flex:.7">
                            <span @click="changeCity(j)" v-for="(j,index) in c.children" :key="index">{{j.label}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ul class="add_list" v-if="showList">
                <div v-if="addressLists!=''">
                    <li @click="assignText(item)" v-for="(item,index) in addressLists" :key="index">
                        {{item.title}} 
                        <span>{{item.address}}</span>    
                    </li>
                </div>
                <div v-else class="notAdd">没有相关地址~</div>
            </ul>
        </div>
        <div id="container" ref="container" :style="{width:mapWidth,height:maiHeight}"></div>
    </div>
</template>

<script>
var geocoder, map;
import city from '../../utils/city';
export default {
    data() {
        return {
            fun: null,
            mapWidth: '',
            maiHeight: '',
            fristForm: {
                longitude: '', //经度
                latitude: '', //纬度
                address: '' //输入的地址
            },
            add_info:'',//子组件传值    
            markersArray:[],
            addressLists: [],//下拉菜单数据
            city:[],
            value:'',
            searchService:'',
            geocoder:'',
        };
    },
    props:{
        mapList:{type:Object}
    },

    computed: {
        showCity() {
            return this.$store.state.popupState2;
        },
        showList() {
            return this.$store.state.popupState1;
        }
    },
    created() {
        if (this.mapList) {
            this.mapWidth = this.mapList.width ? this.mapList.width : '1000px';
            this.maiHeight = this.mapList.height ? this.mapList.height : '600px';
        }
        this.city = city;
    },
    mounted() {
        this.mapTX();
        let geolocation = new qq.maps.Geolocation('ABIBZ-Z7JR6-H7KSV-MXCVY-GS5RS-RJFNS', 'dingzuo');
        geolocation.getLocation(this.showPosition, this.showPositionErr, { timeout: 8000 });
    },
    watch: {
        'fristForm.address': {
            handler: function(val) {
                this.debounce(this.changeStr,500);
                this.childData()
            },
            deep: true
        }
    },
    methods:{
        // 没有 点击下拉菜单时默认赋值返回数据第一个
        defGet(){
            if(this.add_info == ''){
                this.add_info = this.addressLists[0]
                this.value = this.addressLists[0].title
                this.fristForm.longitude = this.addressLists[0].location.lng
                this.fristForm.latitude = this.addressLists[0].location.lat
            }
            console.log(this.add_info)
        },
        childData(){
            console.log(this.add_info)
            this.$emit('child-data',this.add_info)
        },
        showCityFun() {
            this.$store.commit('change', 1);
        },
        showPosition(position) {
            this.value = position.city
            this.fristForm.longitude = position.lng
            this.fristForm.latitude = position.lat
        },
        showPositionErr(err){
            this.value = '成都市'
            this.fristForm.longitude = 104.08329
            this.fristForm.latitude = 30.65618
        },
        // 关闭弹窗
        close() {
            this.showList = false;
            this.showCity = false;
        },
        // 展示搜索结果
        showFun(type) {
            this.$store.commit('change', 3);
        },
        // 防抖
        debounce: function (fn, wait) {
            if (this.fun !== null) {
                clearTimeout(this.fun);
            }
            this.fun = setTimeout(fn, wait);
        },
        changeStr:function(data){
            let address = encodeURI(this.fristForm.address)
            this.$get(`/map/ws/place/v1/search?keyword=${address}&boundary=region(${this.value},0)&key=ABIBZ-Z7JR6-H7KSV-MXCVY-GS5RS-RJFNS`).then(res=>{
                if(res.status == 0){
                    this.addressLists = res.data
                    // this.mapControls(res.data)
                }else{
                    this.$message({
                        message: '地图参数错误，请刷新后再试',
                        type: 'warning'
                    });
                }
            }).catch(err=>{
                console.log(err)
            })
            
            this.searchService.search(this.fristForm.address);
            return
            this.searchService.setLocation(this.value);
        },
        // 地图控件  展示
        mapControls(data){
            var pois = data;
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
        },

        // 点击搜索结果赋值、
        assignText(val){
            // 调用接口时
            this.add_info = val
            this.$store.commit('change', 3)
            this.fristForm.longitude = val.location.lng
            this.fristForm.latitude = val.location.lat
            this.fristForm.address = val.title


            // var pois = results.detail.pois;
            // var latlngBounds = new qq.maps.LatLngBounds();
            // for(var i = 0,l = pois.length;i < l; i++){
            //     var poi = pois[i];
            //     latlngBounds.extend(poi.latLng);  
            //     var marker = new qq.maps.Marker({
            //         map:map,
            //         position: poi.latLng
            //     });

            //     marker.setTitle(poi.name);
            // }
            // map.fitBounds(latlngBounds);



            // 本地搜索时 展示 
            // this.fristForm.longitude = val.latLng.lng
            // this.fristForm.latitude = val.latLng.lat
            // this.fristForm.address = val.name
        },
        // 切换城市
        changeCity(val) {
            this.value = val.label;
        },

        TMap() {
            return new Promise(function (resolve, reject) {
                window.init = function () {
                    resolve(qq);
                };
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=ABIBZ-Z7JR6-H7KSV-MXCVY-GS5RS-RJFNS';
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        mapTX() {
            let that = this;
            this.TMap().then((qq) => {
                var map = new qq.maps.Map(this.$refs.container, {
                    //初始经纬度
                    center: new qq.maps.LatLng(30.611913633860105, 104.08172607421875),
                    zoom: 13
                });
                var scaleControl = new qq.maps.ScaleControl({
                    align: qq.maps.ALIGN.BOTTOM_LEFT,
                    margin: qq.maps.Size(85, 15),
                    map: map
                });
                //绑定单击事件添加参数  点击地图
                qq.maps.event.addListener(map, 'click', function(event) {
                    that.fristForm.longitude = event.latLng.getLng(); // 经度
                    that.fristForm.latitude = event.latLng.getLat(); // 纬度
                    if (that.markersArray) {
                        for (let i in that.markersArray) {
                            that.markersArray[i].setMap(null);
                        }
                    }
                    var marker = new qq.maps.Marker({
                        map: map,
                        position: event.latLng
                    });
                    that.markersArray.push(marker);
                });
                geocoder = new qq.maps.Geocoder({
                    complete: function (result) {
                        map.setCenter(result.detail.location);
                        var gps = result.detail.location.lat + ',' + result.detail.location.lng;
                        var marker = new qq.maps.Marker({
                            map: map,
                            position: result.detail.location
                        });
                        that.markersArray.push(marker);
                        if (that.markersArray.length > 1) {
                            for (let i = 0; i < that.markersArray.length - 1; i++) {
                                that.markersArray[i].setMap(null); //清除标记
                            }
                        }
                    }
                });

                // 本地查询 不调用接口
                this.searchService = new qq.maps.SearchService({
                    complete : function(results){
                        // that.addressLists = results.detail.pois
                        // console.log(results.detail.pois,22222222222)
                        if(results.type === "CITY_LIST") {
                            that.searchService.setLocation(results.detail.cities[0].cityName);
                            that.searchService.search(that.fristForm.address);
                            return;
                        }
                            // var pois = that.addressLists;
                            // console.log(results.detail.pois,1)
                            // console.log(that.addressLists,1)
                            // var latlngBounds = new qq.maps.LatLngBounds();
                            // for(var i = 0,l = pois.length;i < l; i++){
                            //     var poi = pois[i];
                            //     latlngBounds.extend(poi.location);  
                            //     var marker = new qq.maps.Marker({
                            //         map:map,
                            //         position: poi.location
                            //     });

                            //     marker.setTitle(poi.title);
                            // }


                        //  var pois = results.detail.pois;
                        // var latlngBounds = new qq.maps.LatLngBounds();
                        // for(var i = 0,l = pois.length;i < l; i++){
                        //     var poi = pois[i];
                        //     latlngBounds.extend(poi.latLng);  
                        //     var marker = new qq.maps.Marker({
                        //         map:map,
                        //         position: poi.latLng
                        //     });

                        //     marker.setTitle(poi.name);
                        // }
                        // map.fitBounds(latlngBounds);




                        // map.fitBounds(latlngBounds);
                    }
                });
            });
        },

        clearOverlays() {
            if (this.markersArray) {
                for (i in this.markersArray) {
                    this.markersArray[i].setMap(null);
                }
            }
        }
    }
};
</script>

<style scoped lang='less'>
#map {
    height: 100%;
    /deep/ .seac_address {
        width: 1100px;
        width: 100%;
        margin-bottom: 20px;
        position: relative;
        .add_list {
            font-size: 13px;
            width: 300px;
            background: #fff;
            list-style: none;
            padding: 10px 0 10px 0;
            position: absolute;
            z-index: 10;
            box-shadow: 0 2px 5px #5a5a5a;
            border-radius: 5px;
            top: 40px;
            li {
                cursor: pointer;
                line-height: 30px;
                padding: 0 10px;
            }
            li:hover {
                background: rgb(209, 209, 209);
            }
            span {
                color: #888888;
            }
            .notAdd {
                text-align: center;
                color: #9c9c9c;
                padding: 10px 0;
            }
        }
        .city {
            font-size: 12px;
            position: relative;
            display: inline-block;
            .changeCity {
                color: red;
                cursor: pointer;
                margin-left: 10px;
            }
            .cityList {
                position: absolute;
                z-index: 10;
                background: white;
                padding: 10px;
                width: 200px;
                box-shadow: 0 2px 5px #5a5a5a;
                border-radius: 5px;
                top: 25px;
                height: 400px;
                overflow-y: scroll;
                span{
                    margin-right: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    display: inline-block;
                    // width: 25%;
                }
                .city{
                    span{
                        color: #676767;
                    }
                    span:hover{
                        color: red;
                    }
                }
            }
            .cityList::-webkit-scrollbar {display:none}
            .cityList {scrollbar-width: none;}
            .cityList {-ms-overflow-style: none;}
        }
        .el-input--small {
            width: 300px;
            margin-right: 20px;
        }
    }
}
</style>