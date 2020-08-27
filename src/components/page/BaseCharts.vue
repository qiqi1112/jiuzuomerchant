<template>
    <div id="map">
        <input v-model="fristForm.address" placeholder="地址" type="text">
        <input v-model="fristForm.longitude" placeholder="经度" type="text">
        <input  v-model="fristForm.latitude" placeholder="纬度" type="text">

         <el-button size="mini" type="primary" @click="searchKeyword" style="width:100px"
            >搜索</el-button
        >
        <div id="container" ref="container"></div>
    </div>
</template>

<script>
var searchService,geocoder,map,markersArray = [];
export default {
    data() {
        return {
            value1:'广东省深圳市大运地铁站',
            fristForm:{
                longitude:'',
                latitude:'',
                address:''
            }
        };
    },
    created(){
    },
    mounted(){
        // this.initMap()
        this.mapTX()
    },
    methods:{
        initMap(){
            let that = this
            var center = new TMap.LatLng(39.984120, 116.307484)
            var map = new TMap.Map(this.$refs.container, {
                center: center,//设置地图中心点坐标
                zoom: 17.2,   //设置地图缩放级别
                pitch: 43.5,  //设置俯仰角
                rotation: 45    //设置地图旋转角度
            }); 

            // var latlngBounds = new qq.maps.LatLngBounds();
            qq.maps.event.addListener(map, "click", function(event) {
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
            });

            geocoder = new qq.maps.Geocoder({
                complete: function(result) {
                console.log(result);
                that.fristForm.longitude = result.detail.location.lng;
                that.fristForm.latitude = result.detail.location.lat;
                map.setCenter(result.detail.location);
                var marker = new qq.maps.Marker({
                    map: map,
                    position: result.detail.location
                });
                markersArray.push(marker);
                }
            });
        },
        searchKeyword() {
            var keyword = this.fristForm.address;
            //   this.clearOverlays(markersArray);
            // searchService.setLocation("北京");
            //根据输入的关键字在搜索范围内检索
            console.log(geocoder)
            if (keyword) {
                // searchService.search(keyword);
                geocoder.getLocation(keyword);
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
                    console.log('您点击的位置为: [' + event.latLng.getLat() + ', ' + event.latLng.getLng() + ']')
                    geocoder = new qq.maps.Geocoder({
                complete: function(result) {
                console.log(result);
                that.fristForm.longitude = result.detail.location.lng;
                that.fristForm.latitude = result.detail.location.lat;
                map.setCenter(result.detail.location);
                var marker = new qq.maps.Marker({
                    map: map,
                    position: result.detail.location
                });
                markersArray.push(marker);
                }
            });
                })
            })
        }




    },
};
</script>

<style scoped lang='less'>
#container{
    width:1000px;
    height:600px;
}
#pos-area {
            background-color: #009DDC;
            margin-bottom: 10px;
            width: 100%;
            overflow: scroll;
            text-align: left;
            color: white;
        }
        #demo {
            padding: 8px;
            font-size: small;
        }
       #btn-area {
            height: 100px;
        }
        button {
            margin-bottom: 10px;
            padding: 12px 8px;
            width: 42%;
            border-radius: 8px;
            background-color: #009DDC;
            color: white;
        }
</style>