<template>
    <div>
        <button @click="changeMarkerLayer">点击</button>
        <div id="map-container"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },

    methods: {
        //初始化地图
        initMap() {
            //定义地图中心点坐标
            var center = new TMap.LatLng(39.98412, 116.307484);
            //定义map变量，调用 TMap.Map() 构造函数创建地图
            var map = new TMap.Map(document.getElementById('map-container'), {
                center: center, //设置地图中心点坐标
                zoom: 17.2, //设置地图缩放级别
                pitch: 43.5, //设置俯仰角
                rotation: 45 //设置地图旋转角度
            });
        },

        //获取地图中心点
        getCenterLatLng() {
            var centerLatLng = map.getCenter();
            console.log(centerLatLng);
        },

        //修改地图中心点
        setCenterLatLng() {
            let lat = 57.98412;
            let lng = 116.307484;
            map.setCenter(new TMap.LatLng(lat, lng));
        },

        //获取当前点击的坐标点
        getClickHandler() {
            //定义事件处理方法
            var clickHandler = function (evt) {
                var lat = evt.latLng.getLat().toFixed(6);
                var lng = evt.latLng.getLng().toFixed(6);
                console.log('您点击的的坐标是：' + lat + ',' + lng);
            };
            //Map实例创建后，通过on方法绑定点击事件
            map.on('click', clickHandler);
        },

        //添加标记点
        addmarkerLayer() {
            //初始化marker图层
            var markerLayer = new TMap.MultiMarker({
                id: '1',
                map: map
            });
            //监听点击事件添加marker
            map.on('click', (evt) => {
                markerLayer.add({
                    position: evt.latLng
                });
            });
        },

        //修改标记点的位置
        changeMarkerLayer() {
            var markerLayer = new TMap.MultiMarker({
                id: '1',
                map: map
            });

            //修改id为1的点标记的位置
            markerLayer.updateGeometries([
                {
                    id: '1',
                    position: new TMap.LatLng(39.994104, 116.287503)
                }
            ]);
        }
    },

    mounted() {
        this.initMap();
    }
};
</script>

<style>
.map-container {
    /*地图(容器)显示大小*/
    width: 1200px;
    height: 400px;
}
</style>