<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 商品管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container clearfix" v-loading="wrapLoading">
            <!-- 顶部操作模块 -->
            <div class="head-handle clearfix">
                <!-- 左边操作区域 -->
                <el-row class="left-handle">
                    <el-button type="primary" icon="el-icon-plus" @click="addCars" style="margin-right: 10px">添加车辆</el-button>
                    <el-button
                        v-if="goodsData.length > 0"
                        type="danger"
                        icon="el-icon-delete"
                        @click="isSelect = true"
                        style="margin-right: 10px"
                        >批量删除</el-button
                    >
                    <el-button v-if="isSelect && goodsData.length > 0" type="warning" @click="sureDelAll" style="margin-right: 10px"
                        >确定</el-button
                    >
                    <el-button v-if="isSelect && goodsData.length > 0" @click="cancelDelete">取消</el-button>
                </el-row>

                <!-- 右边操作区域 -->
                <div class="right-handle">
                    <!-- <el-button type="primary" @click="handleSelGoodsType" class="mr10" v-if="goodsData.length > 0">APP展示选择</el-button> -->
                    <el-input
                        v-model="searchName"
                        @keydown.13.native="searchGoodsInfo"
                        placeholder="请输入车辆名称"
                        class="handle-input mr10"
                        clearable
                    ></el-input>
                    <el-select v-model="value" placeholder="车辆品牌" class="mr10" style="width: 100px" clearable>
                        <el-option v-for="item in carBrand" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="value" placeholder="车辆型号" class="mr10" style="width: 100px" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="value" placeholder="车辆类型" class="mr10" style="width: 100px" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="searchGoodsInfo">搜索</el-button>
                </div>
            </div>


            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
            >
                <el-table-column label="ID" fixed type="index" align="center" width="50"></el-table-column>
                <el-table-column prop="title" min-width="200" align="center" label="车辆名称"></el-table-column>
                <el-table-column prop="uri" min-width="200" align="center" label="车辆品牌"></el-table-column>  
                <el-table-column prop="result" min-width="200" align="center" label="车辆型号"></el-table-column>
                <el-table-column prop="order_state" min-width="100" align="center" label="车辆类型"></el-table-column>
                <el-table-column prop="ip" min-width="200" align="center" label="车辆标签"></el-table-column>
                <el-table-column prop="createTime" min-width="150" align="center" label="其他属性及价格"></el-table-column>  
                <el-table-column label="操作" width="280" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="lineDb(scope.row, scope.$index)">编辑</el-button>
                        <el-button type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 翻页区域 -->
            <div>
                <el-pagination
                    v-if="goodsData.length > 0"
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="dataListCount"
                    :current-page="currentPage"
                    :page-size="pagesize"
                    class="page"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="58%">
            <el-form ref="form" :model="form" label-width="100px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>车辆信息</span>
                </div>
                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="选择品牌">
                                <el-select v-model="carBrandValue" @change="changeCarBrand" filterable placeholder="请选择品牌">
                                    <el-option
                                    v-for="item in carBrand"
                                    :key="item.id"
                                    :label="item.brand"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="车辆型号">
                                <el-select v-model="carModelValue" @change="changeCarModel" filterable placeholder="请选择车辆型号">
                                    <el-option
                                    v-for="item in carModel"
                                    :key="item.id"
                                    :label="item.modelName"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="车辆选择" v-show="carList.length>0">
                                <div class="car_list">
                                    <div class="car_box" v-for="(item,i) in carList" :key="i">
                                        <div class="car_btn" @click="selectCarImage(item,i)">选择</div>
                                        <el-image
                                            :class="carListIndex == i?'car_active':''"
                                            class="car_img"
                                            :src="joinUrl + item.vehiclePicture" 
                                            :preview-src-list="bigCarList">
                                        </el-image>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item label="车辆类型" v-show="carListSelect">
                                <span class="rm" >{{carListSelect.vehicleLabelName}}</span>
                                <span>车辆属性：</span>
                                <span>{{carListSelect.transmission}} · {{carListSelect.seatNum}}座 · {{carListSelect.displacement}}T</span>
                            </el-form-item>

                            <el-form-item label="车辆库存">
                                <el-input v-model="inventory">
                                    <template slot="append">辆</template>
                                </el-input>
                            </el-form-item>
                          
                            <el-form-item label="选择车辆标签">
                                <span v-for="(item,i) in  carLab" :key="i" style="margin-right:10px">
                                    <el-button :type="carLabIndex==i?'primary':''"  @click="selectCarLab(item,i)">{{item.labelName}}</el-button>
                                </span>
                                <span class="lm">标签说明：{{carLabIndex>=0?carLab[carLabIndex].labelExplain:'--'}}</span>
                            </el-form-item>


                            <el-form-item label="基础服务费">
                                <el-input v-model="basicsServePrice">
                                    <template slot="append">￥/天</template>
                                </el-input>
                                <label class="lm" for="">车行手续费：</label>
                                <el-input v-model="carServePrice">
                                    <template slot="append">￥</template>
                                </el-input>
                            </el-form-item>


                            <div class="fx el-form-item">
                                <div class="left_lab">本店车辆图片</div>  
                                <div class="right_text">
                                    <el-upload
                                        v-loading="loading"
                                        class="avatar-uploader"
                                        action="fakeaction"
                                        list-type="picture-card"
                                        :on-preview="handlePictureCardPreview"
                                        :http-request="uploadSectionFile"
                                        :limit="5"
                                        :auto-upload="false"
                                        multiple
                                        :file-list="carPicture"
                                        :on-change="handleChange"
                                        :on-remove="handleRemove"
                                    >
                                        <i class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="" />
                                    </el-dialog>
                                </div>
                            </div>

                            <hr>

                            <div class="column">
                                <span class="line lw2"></span>
                                <span>车辆租赁价格</span>  <span style="color:red">(APP用户最多租用30天的车)</span>
                            </div>

                            <div>
                                <div class="btm_h fx">
                                    <div class="f_l">
                                        <label class="lab_width" for="">租赁时间</label>
                                        <el-input v-model="leasePrice.startTime" @blur="monitorRentCarPriceWrite(leasePrice.startTime,1)">
                                            <template  slot="append">≤天</template>
                                        </el-input> 
                                    </div>

                                    <div class="f_r">
                                        <label class="lab_width" for="">租赁价格</label>
                                        <el-input v-model="leasePrice.startPrice">
                                            <template slot="append">元/天</template>
                                        </el-input>
                                    </div>
                                </div>


                    
                                <div class="btm_h pos_box">
                                    <el-form :model="betweenNumberForm" ref="betweenNumberForm"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in betweenNumberForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="fx">
                                                <div class="f_l ">
                                                    <div class="label_mar">
                                                        <el-input v-model="domain.betweenStarNum">
                                                            <template slot="append">天</template>
                                                        </el-input>
                                                        <span> ＜天数≤ </span>
                                                        <el-input v-model="domain.betweenEndNum">
                                                            <template slot="append">天</template>
                                                        </el-input>
                                                    </div>
                                                </div>

                                                <div class="f_r">
                                                    <label class="lab_width" for="">租赁价格</label>
                                                    <el-input v-model="domain.betweenPriceNum">
                                                        <template slot="append">元/天</template>
                                                    </el-input>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                    <img @click="addBetweenNumber" class="addItem at1" src="../../assets/img/jia.png" alt="">
                                    <img @click="minusBetweenNumber" class="minusItem mt1" src="../../assets/img/jian.png" alt="">
                                </div>

                                

                                <div class="btm_h fx">
                                    <div class="f_l ">
                                        <div class="label_mar">
                                            <el-input v-model="leasePrice.endTime" @blur="monitorRentCarPriceWrite(leasePrice.endTime,4)">
                                                <template slot="append">≥天</template>
                                            </el-input>
                                        </div>
                                    </div>

                                    <div class="f_r">
                                        <label class="lab_width" for="">租赁价格</label>
                                        <el-input v-model="leasePrice.endPrice">
                                            <template slot="append">元/天</template>
                                        </el-input>
                                    </div>
                                </div>


                                <div class="btm_h pos_box">
                                    <el-form :model="specialNumberForm" ref="specialNumberForm"  class="demo-dynamic" >
                                        <el-form-item
                                            v-for="(domain, index) in specialNumberForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div class="fx">
                                                <div class="f_l">
                                                    <label class="lab_width" for="">特殊价格</label>
                                                    <el-date-picker
                                                        v-model="domain.specialStarNum"
                                                        type="date"
                                                        placeholder="选择日期">
                                                    </el-date-picker>
                                                    <span> ＜天数≤ </span>
                                                    <el-date-picker
                                                        v-model="domain.specialEndNum"
                                                        type="date"
                                                        placeholder="选择日期">
                                                    </el-date-picker>
                                                </div>

                                                <div class="f_r">
                                                    <label class="lab_width" for="">租赁价格</label>
                                                    <el-input v-model="domain.specialPriceNum">
                                                        <template slot="append">元/天</template>
                                                    </el-input>
                                                </div>
                                            </div>
                                        </el-form-item>
                                    </el-form>

                                    <img @click="addSpecialNumber" class="addItem at1" src="../../assets/img/jia.png" alt="">
                                    <img @click="minusSpecialNumber" class="minusItem mt1" src="../../assets/img/jian.png" alt="">
                                </div>

                                <div class="btm_h btns">
                                    <el-button type="primary">重置租赁价格</el-button>
                                    <el-button type="primary">确定</el-button>
                                </div>
                            </div>

                            <hr>

                            <div class="column">
                                <span class="line lw2"></span>
                                <span>车辆接送价格</span>
                            </div>

                   
                            <div>
                                <div class="btm_h fx">
                                    <div class="f_l">
                                        <label class="lab_width" for="">接送路程</label>
                                        <el-input v-model="pickAndUp.startDistance">
                                            <template slot="append">≤Km</template>
                                        </el-input>
                                    </div>

                                    <div class="f_r">
                                        <label class="lab_width" for="">租赁价格</label>
                                        <el-input v-model="pickAndUp.startPrice">
                                            <template slot="append">元/次</template>
                                        </el-input>
                                    </div>
                                </div>


                                <div class="btm_h fx pos_box">
                                    <div class="f_l ">
                                        <div class="">
                                            <label class="lab_width" for="">接送路程</label>
                                            <el-input>
                                                <template slot="append">km/内</template>
                                            </el-input>
                                            <span> ＜里程≤ </span>
                                            <el-input>
                                                <template slot="append">km/内</template>
                                            </el-input>
                                        </div>
                                    </div>

                                    <div class="f_r">
                                        <label class="lab_width" for="">租赁价格</label>
                                        <el-input>
                                            <template slot="append">元/次</template>
                                        </el-input>
                                    </div>

                                    <img class="addItem at1" src="../../assets/img/jia.png" alt="">
                                </div>



                                <div class="btm_h fx">
                                    <div class="f_l">
                                        <label class="lab_width" for="">接送路程</label>
                                        <el-input v-model="pickAndUp.endDistance">
                                            <template slot="append">≥km</template>
                                        </el-input>
                                    </div>

                                    <div class="f_r">
                                        <label class="lab_width" for="">租赁价格</label>
                                        <el-input v-model="pickAndUp.endPrice">
                                            <template slot="append">元/次</template>
                                        </el-input>
                                    </div>
                                </div>





                                <div class="pos_box">
                                    <div class="addSeg">
                                        <div class="btm_h fx">
                                            <div class="f_l">
                                                <label class="lab_width" for="">特殊价格</label>
                                                <el-input>
                                                    <el-button slot="append" icon="el-icon-date"></el-button>
                                                </el-input>
                                                <span> ＜日期≤ </span>
                                                <el-input>
                                                    <el-button slot="append" icon="el-icon-date"></el-button>
                                                </el-input>
                                            </div>

                                            <div class="f_r">
                                                <label class="lab_width" for="">特殊日期里程</label>
                                                <el-input>
                                                    <template slot="append">km/内</template>
                                                </el-input>
                                                <span> ＜里程≤ </span>
                                                <el-input>
                                                    <template slot="append">km/内</template>
                                                </el-input>
                                            </div>
                                        </div>
                                        <div class="btm_h fx">
                                            <div class="">
                                                <label class="lab_width" for="">特殊日期价格</label>
                                                <el-input>
                                                    <template slot="append">元/次</template>
                                                </el-input>

                                            </div>
                                        </div>
                                    </div>
                                    <img class="addItem at2" src="../../assets/img/jia.png" alt="">
                                </div>




                                <div class="btm_h btns">
                                    <el-button type="primary">重置接送价格</el-button>
                                    <el-button type="primary">确定</el-button>
                                </div>
                            </div>

                            <hr>


                        </div>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">返回</el-button>
                <el-button @click="saveCarInfo" type="primary">确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表格数据分页相关属性
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认页码
            pagesize: 10, //默认每页要显示多少条数据
            goodsData: [], //请求到的商品信息数组
            activeNum: '', //标签页对应的下标（种类 1-套餐 2-威士忌 3-白兰地 4-伏特加 5-香槟 6-红酒 7-啤酒 8-鸡尾酒 9-小吃 10-其它 11-会员卡）
            //商品分类下拉框
            tableData:[],
            value:'',
            searchName:'',
            isSelect:false,
            wrapLoading:false,
            editVisible:true,
            form:{},
            carPicture:[],
            dialogImageUrl: '',
            dialogVisible: false,
            loading:false,
            dialogImageUrl: '',
            dialogVisible: false,
            formData: [],
            joinUrl: this.$imgHead,
            options:[],

            carBrandLIst:[],//车辆品牌 用于列表展示
            carModelLIst:[],//车辆型号 用于列表展示
            carTypeLIst:[],//车辆类型 用于列表展示
            carLabLIst:[],//车辆标签 用于列表展示



            carBrandValue:'',//品牌选择器绑定值
            carModelValue:'',//型号选择器绑定值

            carBrand:[],//车辆品牌
            carModel:[],//车辆型号
            carType:[],//车辆类型
            carLab:[],//车辆标签
            carList:[], //详情页 选择品牌，型号后展示图片数组
            bigCarList:[],//详情页 选择品牌，型号后展示图片数组 大图
            carListIndex:null,//已选中的图片下标
            carListSelect:"",//已选中的图片信息

            inventory:'',//库存
            carLabIndex:-1,//已选中的标签下标

            basicsServePrice:'',//基础服务费
            carServePrice:'',//车行服务费

            leasePrice:{
                startTime:'',//开始时间
                endTime:'',//结束时间
                startPrice:'',//开始钱
                endPrice:'',//结束钱
            },//租赁价格


            betweenNumberForm:{
                domains:[
                    {
                        betweenStarNum:'',
                        betweenEndNum:'',
                        betweenPriceNum:'',
                    }
                ]
            },//租赁时间 中间 时间段

            specialNumberForm:{
                domains:[
                    {
                        specialStarNum:'',
                        specialEndNum:'',
                        specialPriceNum:'',
                    }
                ]
            },//特殊时间 价格


            pickAndUp:{
                startDistance:'',//起始路程
                endDistance:'',//结束路程
                startPrice:'',//起始钱
                endPrice:'',//结束钱
            },//接送路程

            distanceNumberForm:{
                domains:[
                    {
                        distanceStarNum:'',
                        distanceEndNum:'',
                        distancePriceNum:'',
                    }
                ]
            },//接送路程  距离/价格


            distanceNumberForm:{
                domains:[
                    {
                        distanceStarNum:'',
                        distanceEndNum:'',
                        distancePriceNum:'',
                    }
                ]
            },//接送路程 特殊 距离/价格
        };
    },

    created(){
        this.getBrandType()
    },

    methods: {
        // 获取车辆品牌和型号 类型
        getBrandType(){
            this.$get('/merchant/store/vehicleGoods/getMsgBasic').then((res) => {
                if (res.code === 0) {
                    this.carBrand = res.data.adminBrandDTOS
                    this.carType = res.data.adminLabelDTOS
                    this.carLab = res.data.vehicleUseLabelDTOS
                }
            });
        },

        // 详情中 选择品牌
        changeCarBrand(val){
            for(let i=0;i<this.carBrand.length;i++){
                if(this.carBrand[i].id == val){
                    this.carListIndex = null
                    this.carListSelect = ''
                    // this.carLabIndex = null
                    this.carModelValue = ''
                    this.carList = []
                    this.bigCarList = []
                    this.carModel = this.carBrand[i].adminModelDTOS
                    break
                }
            }
        },

        //详情中 选择型号
        changeCarModel(val){
            if(this.carBrandValue && val){
                this.$post('/merchant/store/vehicleGoods/msgInfo',{
	                brandId: this.carBrandValue,
	                modelId: val
                }).then((res) => {
                    if (res.code === 0) {
                        this.bigCarList = []
                        this.carListIndex = null
                        // this.carLabIndex = null
                        this.carListSelect = ''
                        res.data.forEach(v=>{
                            this.bigCarList.push(this.joinUrl + v.vehiclePicture)
                        })
                        this.carList = res.data
                    }
                });
            }
        },
        // 添加租赁价格  中间 时间段
        addBetweenNumber() {
            let betweenNumberForm = this.betweenNumberForm.domains
            if(betweenNumberForm[betweenNumberForm.length-1].betweenStarNum == '' || betweenNumberForm[betweenNumberForm.length-1].betweenEndNum == ''){
                this.$message({
                    message: '请先输入本条信息，再添加',
                    type: 'warning'
                });
                return
            }

            betweenNumberForm.push({
                betweenStarNum:'',
                betweenEndNum:'',
                betweenPriceNum:'',
            });
        },
        // 删除 租赁价格  中间 时间段  最后一条
        minusBetweenNumber(){
            if(this.betweenNumberForm.domains.length<=1){
                return
            }
            this.betweenNumberForm.domains.splice(this.betweenNumberForm.domains.length-1, 1);
        },


        // 添加租赁价格 特殊 时间 
        addSpecialNumber() {

            let specialNumberForm = this.specialNumberForm.domains
            if(specialNumberForm[specialNumberForm.length-1].specialStarNum == '' || specialNumberForm[specialNumberForm.length-1].specialEndNum == ''){
                this.$message({
                    message: '请先输入本条信息，再添加',
                    type: 'warning'
                });
                return
            }

            specialNumberForm.push({
                specialStarNum:'',
                specialEndNum:'',
                specialPriceNum:'',
            });
        },
        // 删除 租赁价格 特殊  时间段  最后一条
        minusSpecialNumber(){
            if(this.specialNumberForm.domains.length<=1){
                return
            }
            this.specialNumberForm.domains.splice(this.specialNumberForm.domains.length-1, 1);
        },



        // 选择车辆
        selectCarImage(val,index){
            this.carListIndex = index
            this.carListSelect = val
        },

        // 选择标签  及 标签说明
        selectCarLab(val,index){
            this.carLabIndex = index
        },

        //编辑
        addCars() {
            this.editVisible = true;
        },
        //搜索操作
        searchGoodsInfo() {
            this.currentPage = 1;
            // this.getGoodsInfo(); //请求数据
        },
        //翻页操作
        handleCurrentChange(val) {
            this.currentPage = val; //将当前跳转的页码赋给显在页面上的页码
        },

        // 监听车辆租赁  天数
        monitorRentCarPriceWrite(value,classify){
            switch (classify){
                case 1:
                    if(value>30){
                        this.$message({
                            showClose: true,
                            message: '输入的天数不能大于30天',
                            type: 'error'
                        });
                    }
                    break
                case 4:
                    let betweenNumberForm = this.betweenNumberForm.domains
                    let last_data = betweenNumberForm[betweenNumberForm.length-1]
                    let last_but_one = ''
                    if(value>30){
                        this.$message({
                            showClose: true,
                            message: '输入的天数不能大于30天',
                            type: 'error'
                        });
                        return
                    }

                    if(betweenNumberForm.length <= 1){
                        // 没有考虑  如果betweenNumberForm 没有添加完成  只有其中一个有值
                        if(last_data.betweenEndNum == '' || last_data.betweenStarNum == ''){
                            // 这里表示  租赁区间没有添加值  可直接判断 leasePrice.startTime 的值

                            
                        }        
                    }else{
                        if(last_data.betweenEndNum == '' || last_data.betweenStarNum == ''){
                            // 这里表示  租赁区间最后一条没有添加值  可直接判断 倒数第二条
                            last_but_one = betweenNumberForm[betweenNumberForm.length-2]

                            
                        }else{

                        }  
                    }
                    
                    break
            }
        },



        saveCarInfo(){
            console.log(this.carListSelect)
            let carListImage = []
            this.carPicture.forEach(v=>{
                carListImage.push(v.name)
            })
            carListImage = carListImage.join(',')
            let data = {
                basicCost : this.basicsServePrice,
                serviceCharge : this.carServePrice,
                imgs:carListImage,
                vehicleMsgId : this.carListSelect.id
            }
            console.log(data)
        },

        //验证表单
        checkFormInfo() {
            if (!this.goodsForm.name) {
                this.$message.error('请输入商品名称');
                return;
            } else if (this.goodsForm.checkedBanner === true && !this.goodsForm.bannerImageUrl) {
                this.$message.error('请上传商店广告位图片');
                return;
            } else if (this.goodsForm.checkedReco === true && !this.goodsForm.recoImageUrl) {
                this.$message.error('请上传商家推荐位图片');
                return;
            } else if (!this.goodsForm.thumImageUrl) {
                if (this.activeNum == 11) {
                    this.$message.error('请选择会员卡缩略图');
                } else {
                    this.$message.error('请上传商品缩略图');
                }
                return;
            } else if (!this.goodsForm.detailImageUrl && this.activeNum != 11) {
                this.$message.error('请上传商品详情图');
                return;
            } else {
                if (this.activeNum == 1) {
                    if (this.goodsForm.tableData.length === 0) {
                        this.$message.error('请选择套餐内的商品');
                        return;
                    } else if (!this.goodsForm.comboNowPrice) {
                        this.$message.error('请输入套餐现单价');
                        return;
                    } else {
                        this.allRegRight = true;
                    }
                } else if (this.activeNum == 11) {
                    if (!this.goodsForm.originPrice) {
                        this.$message.error('请输入会员卡积分');
                        return;
                    } else if (!this.goodsForm.statisticalPrice) {
                        this.$message.error('请输入会员卡原价');
                        return;
                    } else if (!this.goodsForm.nowPrice) {
                        this.$message.error('请输入会员卡现价');
                        return;
                    } else {
                        this.allRegRight = true;
                    }
                } else {
                    if (this.goodsForm.dynamicValidateForm.domains.length === 0) {
                        this.$message.error('请至少输入一种商品规格');
                        return;
                    } else {
                        let arr = this.goodsForm.dynamicValidateForm.domains;
                        for (let i = 0; i < arr.length; i++) {
                            if (+arr[i].statisticalPrice > +arr[i].originalPrice) {
                                this.$message.error('规格现价不能大于原价');
                                this.allRegRight = false;
                                break;
                            } else {
                                this.allRegRight = true;
                            }
                        }
                    }
                }
            }
        },
        // 图片上传
        uploadImg() {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            let fromdata = new FormData();
            fromdata.append('file', this.formData);
            this.$file_post('/merchant/store/system/upload/create', fromdata, config).then((res) => {
                if (res.code == 0) {
                    let img = {
                        name: res.data,
                        url: this.joinUrl + res.data
                    };
                    this.carPicture.push(img);
                } else {
                    this.$message.error(`图片上传失败，请刷新后再试`);
                }
                this.loading = false;
            });
        },
        handleRemove(file, fileList) {
            this.carPicture.forEach((i, index) => {
                if (file.name == i.name) {
                    this.carPicture.splice(index, 1);
                }
            });
        },
        handleChange(file, fileList) {
            this.formData = file.raw;
            this.loading = true;
            this.uploadImg();
        },
        uploadSectionFile(file) {},
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    },

    mounted() {
        // this.getGoodsInfo(); //请求首页数据
    }
};
</script>

<style lang="less" scoped>
.head-handle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    .left-handle {
        // float: left;

        /deep/.el-button + .el-button {
            margin-left: 0;
        }
    }

    .right-handle {
        // float: right;

        .handle-input {
            width: 170px;
            display: inline-block;
        }

        .mr10 {
            margin-right: 10px;
        }
    }
}
.top_info{
    .car_list{
        display: flex;
        flex-wrap: wrap;
        .car_box{
            width: 20%;
            margin-right: 20px;
            position: relative;
            cursor: pointer;
            .car_img{
                width: 100%;
            }
            .car_btn{
                font-size: 12px;
                cursor: pointer;
                position: absolute;
                right: 0;
                bottom: 11px;
                z-index: 1;
                background:#67c23a;
                color: white;
                height: 28px;
                width: 50px;
                text-align: center;
            }
        }
        .car_active{
            border: 4px solid #43c6ff;
            box-sizing: border-box;
        }
    }
    .lab_width{
        width: 100px;
        display: inline-block;
    }
    .lm{
        margin-left: 150px;
    }
    
    .rm{
        margin-right: 150px;
    }
    .btm_h{
        margin-bottom: 20px;
    }
    .add_btm_h{
        margin-bottom: 10px;
    }
    .label_mar{
        margin-left: 100px;
    }
    .fx{
        display: flex;
    }
    .f_l{
        flex: .5;
    }
    .f_r{
        flex: .5;
    }
    .btns{
        text-align: right;
    }
    .f_l_l,.f_l_m,.f_l_r{
        flex: 1;
    }
    .addSeg{
        padding-top: 10px;
        border-top: 1px dashed #999999;
    }
    .addItem,.minusItem{
        height: 32px;
        width: 32px;
        vertical-align: middle;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        z-index: 1;
    }
    .at1{
        left: 770px;
    }
    .mt1{
        left: 820px;
    }
    .at2{
        left: 240px;
    }
    .mt2{
        left: 290px;
    }
    .pos_box{
        position: relative;
    }
    
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    /deep/.el-upload--picture-card,
    /deep/.el-upload-list__item {
        width: 370px;
        height: 192px;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 370px;
        height: 192px;
        line-height: 192px;
        text-align: center;
    }
    .avatar {
        width: 370px;
        height: 192px;
        display: inline-block;
    }
    /deep/.el-upload-list__item {
        transition: none !important;
    }
    
    /deep/.show-type-dialog {
        .el-dialog {
            width: 55%;
    
            .add-classify-title {
                display: flex;
                align-items: center;
                margin-bottom: 30px;
            }
    
            .add-classify-title::before {
                display: inline-block;
                content: '';
                width: 4px;
                height: 20px;
                margin-right: 10px;
                background-color: #999;
            }
    
            .el-checkbox {
                margin-bottom: 20px;
            }
        }
    }
    .left_lab{
        width: 100px;
    }
    .right_text{
        flex: 1;
    }

}

.page {
    text-align: right;
    margin-top: 20px;
}

/deep/.el-input-group__append,
.el-input-group__prepend {
    padding: 0 10px;
}

/deep/.el-upload--picture-card {
    background-color: #fff;
}

/deep/.el-dialog {
    width: 65%;
}
/deep/ .el-dialog {
    min-width: 1100px;
    height: 90vh;
    overflow-y: scroll;
    margin-top: 4vh!important;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: rgb(230, 230, 230);
        border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
        background: #b1b1b1;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: rgb(187, 187, 187);
    }
    &::-webkit-scrollbar-corner {
        background: #179a16;
    }
}
/deep/.el-form-item__content {
    margin-left: 0 !important;
}

/deep/.el-dialog__header {
    padding: 0;
}
/deep/.el-input-group{
    width: 110px;
}
/deep/.el-input__inner{
    // padding: 0 10px;
    min-width: 76px;
}
/deep/.el-icon-circle-close{
    color: white;
}
/deep/.el-date-editor{
    width: 140px;
}
</style>