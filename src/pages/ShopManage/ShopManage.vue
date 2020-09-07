<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container clearfix">
            <!-- 顶部操作模块 -->
            <div class="head-handle clearfix">
                <!-- 左边操作区域 -->
                <el-row class="left-handle">
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加商品</el-button>
                    <el-button type="danger" icon="el-icon-delete " @click="handleDelAll">批量删除</el-button>
                </el-row>

                <!-- 添加商户的对话框 -->
                <el-dialog
                    :visible.sync="dialogVisible"
                    class="add-goods-dialog"
                    @close="handleCancel"
                >
                    <!-- 编辑当前商品时 -->
                    <el-tabs v-if="isUpdate" v-model="activeName">
                        <!-- 套餐标签页 -->
                        <el-tab-pane v-if="activeName=='combo'" label="套餐" name="combo">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <combo-tab
                                v-if="activeName=='combo'"
                                :comboFormParent="comboForm"
                                @comboFormChild="getChildComboForm"
                            ></combo-tab>
                        </el-tab-pane>

                        <!-- 酒水标签页 -->
                        <el-tab-pane v-if="activeName=='drinks'" label="酒水" name="drinks">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <drinks-tab
                                v-if="activeName=='drinks'"
                                :drinksFormParent="drinksForm"
                                @drinksFormChild="getChildDrinksForm"
                            ></drinks-tab>
                        </el-tab-pane>

                        <!-- 小吃标签页 -->
                        <el-tab-pane v-if="activeName=='snack'" label="小吃" name="snack">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <snack-tab
                                v-if="activeName=='snack'"
                                :snackFormParent="snackForm"
                                @snackFormChild="getChildSnackForm"
                            ></snack-tab>
                        </el-tab-pane>

                        <!-- 其他标签页 -->
                        <el-tab-pane v-if="activeName=='other'" label="其他" name="other">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <other-tab
                                v-if="activeName=='other'"
                                :otherFormParent="otherForm"
                                @otherFormChild="getChildOtherForm"
                            ></other-tab>
                        </el-tab-pane>

                        <!-- 会员卡标签页 -->
                        <el-tab-pane v-if="activeName=='vipCard'" label="会员卡" name="vipCard">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <vip-card-tab
                                v-if="activeName=='vipCard'"
                                :vipCardFormParent="vipCardForm"
                                @vipCardFormChild="getChildVipCardForm"
                            ></vip-card-tab>
                        </el-tab-pane>
                    </el-tabs>

                    <!-- 点击添加商品时 -->
                    <el-tabs v-else v-model="activeName" @tab-click="handleClick">
                        <!-- 套餐标签页 -->
                        <el-tab-pane label="套餐" name="combo">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <combo-tab
                                v-if="activeName=='combo'"
                                :comboFormParent="comboForm"
                                @comboFormChild="getChildComboForm"
                            ></combo-tab>
                        </el-tab-pane>

                        <!-- 酒水标签页 -->
                        <el-tab-pane label="酒水" name="drinks">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <drinks-tab
                                v-if="activeName=='drinks'"
                                :drinksFormParent="drinksForm"
                                @drinksFormChild="getChildDrinksForm"
                            ></drinks-tab>
                        </el-tab-pane>

                        <!-- 小吃标签页 -->
                        <el-tab-pane label="小吃" name="snack">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <snack-tab
                                v-if="activeName=='snack'"
                                :snackFormParent="snackForm"
                                @snackFormChild="getChildSnackForm"
                            ></snack-tab>
                        </el-tab-pane>

                        <!-- 其他标签页 -->
                        <el-tab-pane label="其他" name="other">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <other-tab
                                v-if="activeName=='other'"
                                :otherFormParent="otherForm"
                                @otherFormChild="getChildOtherForm"
                            ></other-tab>
                        </el-tab-pane>

                        <!-- 会员卡标签页 -->
                        <el-tab-pane label="会员卡" name="vipCard">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <vip-card-tab
                                v-if="activeName=='vipCard'"
                                :vipCardFormParent="vipCardForm"
                                @vipCardFormChild="getChildVipCardForm"
                            ></vip-card-tab>
                        </el-tab-pane>
                    </el-tabs>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="handleCancel">取 消</el-button>
                        <el-button type="primary" @click="handleSure">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 右边操作区域 -->
                <div class="right-handle">
                    <el-input
                        v-model="searchName"
                        @keydown.13.native="handleSearch"
                        placeholder="商品名称"
                        class="handle-input mr10"
                        clearable
                    ></el-input>
                    <el-select
                        v-model="value"
                        placeholder="选择分类"
                        class="mr10"
                        style="width:100px"
                        clearable
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </div>
            </div>

            <!-- 商品列表 -->
            <div class="goodsList">
                <div class="goods-box" v-for="(item,index) in goodsData" :key="index">
                    <img :src="showImgPrefix + item.listPicture" alt />
                    <div class="goods-detail">
                        <h4 title="商品名称">{{item.name}}</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥{{item.presentPrice}}</span>
                            <s>￥{{item.originalPrice}}</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit(item.id)">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
                        </el-row>
                    </div>
                </div>
            </div>

            <!-- 翻页区域 -->
            <div>
                <el-pagination
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
    </div>
</template>

<script>
import comboTab from './ComboTab';
import drinksTab from './DrinksTab';
import snackTab from './SnackTab';
import otherTab from './OtherTab';
import vipCardTab from './VipCardTab';

export default {
    components: {
        comboTab,
        drinksTab,
        snackTab,
        otherTab,
        vipCardTab
    },
    data() {
        return {
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            searchName: '', //商品名称输入框
            value: '', //商品酒水分类下拉框

            dialogVisible: false, //添加商品的对话框
            activeName: '', //默认展示的标签页
            activeNum: '', //标签页对应的下标

            // 表格数据分页相关属性
            dataListCount: 100, //默认当前要显示的数据条数
            currentPage: 1, //默认页码
            pagesize: 16, //默认每页要显示多少条数据

            goodsData: [], //请求到的商品信息数组

            //套餐标签页表单
            comboForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图
                tableData: [], //渲染表格时的所有商品数据
                goodsIdList: [] //所有已选择的商品对应的id
            },

            //酒水标签页表单
            drinksForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                checkedReco: false,
                goodWeight: 0, //商品排序
                recoWeight: 0, //商家推荐位排序
                classify: 1, //酒水分类

                bannerImageUrl: '', //广告图
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //酒水新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            spec: '', //规格
                            originPrice: '', //规格原价
                            nowPrice: '', //规格现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [] //sku码数组
            },

            //小吃标签页表单
            snackForm: {
                name: '',
                desc: '',
                weight: 0,
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,

                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //小吃新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '', //规格现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [] //sku码数组
            },

            //其他标签页表单
            otherForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //其他新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '', //规格现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [] //sku码数组
            },

            //会员卡标签页表单
            vipCardForm: {
                name: '',
                weight: 0,
                desc: '',
                integral: '', //积分
                nowPrice: '',
                checkedBanner: false,
                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //商品分类下拉框
            options: [
                {
                    label: '套餐 ',
                    value: 1
                },
                {
                    label: '酒水',
                    value: 2
                },
                {
                    label: '小吃',
                    value: 3
                },
                {
                    label: '其它',
                    value: 4
                },
                {
                    label: '会员卡',
                    value: 5
                }
            ],

            isUpdate: false, //是否为修改操作
            goodId: '' //当前编辑的商品id
        };
    },

    methods: {
        //翻页
        handleCurrentChange(val) {
            this.currentPage = val; //将当前跳转的页码赋给显在页面上的页码
            // this.getGoodsInfo({ pageNo: this.currentPage }); //请求翻页后的数据
            this.getGoodsInfo(); //请求翻页后的数据
        },

        //批量删除商品
        handleDelAll() {},

        //搜索按钮
        handleSearch() {
            this.getGoodsInfo();
            // this.searchName = '';
            // this.value = '';
        },

        //添加商品
        handleAdd() {
            this.dialogVisible = true;
            this.activeName = 'combo';
            this.activeNum = 1;
            this.isUpdate = false;
        },

        //关闭对话框操作
        handleCancel() {
            this.dialogVisible = false;
            this.activeName = '';
            this.activeNum = '';
            this.isUpdate = false;
            this.clearAllForm(); //清空所有表单
        },

        //添加/修改套餐
        setComboInfo() {
            let data = {
                type: this.activeNum,
                name: this.comboForm.name,
                goodsSort: this.comboForm.weight,
                synopsis: this.comboForm.desc,
                originalPrice: this.comboForm.originPrice,
                presentPrice: this.comboForm.nowPrice,
                recommendAdStatus: this.comboForm.checkedBanner,
                recommendStatus: 2,
                recommendAdPicture: this.comboForm.bannerImageUrl,
                listPicture: this.comboForm.thumImageUrl,
                infoPicture: this.comboForm.detailImageUrl,
                setMealGoodsList: this.comboForm.tableData,
                id: this.goodId
            };

            console.log('修改/添加时的值', data);

            if (this.isUpdate) {
                this.updateGoodsAjaxPost(data); //修改商品请求
            } else {
                this.addGoodsAjaxPost(data); //添加商品请求
            }
        },

        //添加/修改酒水
        setDrinksInfo() {
            let data = {
                infoPicture: this.drinksForm.detailImageUrl,
                listPicture: this.drinksForm.thumImageUrl,
                name: this.drinksForm.name,
                originalPrice: this.drinksForm.originPrice,
                presentPrice: this.drinksForm.nowPrice,
                recommendAdStatus: this.drinksForm.checkedBanner,
                recommendStatus: this.drinksForm.checkedReco,
                synopsis: this.drinksForm.desc,
                type: this.activeNum,
                category: this.drinksForm.classify,
                goodsSort: this.drinksForm.goodWeight,
                recommendAdPicture: this.drinksForm.bannerImageUrl,
                recommendPicture: this.drinksForm.recoImageUrl,
                recommendPictureSort: this.drinksForm.recoWeight,
                skuList: this.drinksForm.dynamicValidateForm.domains,
                deleteSkuList: this.drinksForm.skuCodeArr,
                id: this.goodId
            };

            console.log('修改/添加时的值', data);

            if (this.isUpdate) {
                this.updateGoodsAjaxPost(data); //修改商品请求
            } else {
                this.addGoodsAjaxPost(data); //添加商品请求
            }
        },

        //添加/修改小吃
        setSnackInfo() {
            let data = {
                type: this.activeNum,
                name: this.snackForm.name,
                goodsSort: this.snackForm.weight,
                synopsis: this.snackForm.desc,
                originalPrice: this.snackForm.originPrice,
                presentPrice: this.snackForm.nowPrice,
                recommendAdStatus: this.snackForm.checkedBanner,
                recommendStatus: 2,
                recommendAdPicture: this.snackForm.bannerImageUrl,
                listPicture: this.snackForm.thumImageUrl,
                infoPicture: this.snackForm.detailImageUrl,
                skuList: this.snackForm.dynamicValidateForm.domains,
                deleteSkuList: this.snackForm.skuCodeArr,
                id: this.goodId
            };

            console.log('修改/添加时的值', data);

            if (this.isUpdate) {
                this.updateGoodsAjaxPost(data); //修改商品请求
            } else {
                this.addGoodsAjaxPost(data); //添加商品请求
            }
        },

        //添加/修改其他
        setOtherInfo() {
            let data = {
                type: this.activeNum,
                name: this.otherForm.name,
                goodsSort: this.otherForm.weight,
                synopsis: this.otherForm.desc,
                originalPrice: this.otherForm.originPrice,
                presentPrice: this.otherForm.nowPrice,
                recommendAdStatus: this.otherForm.checkedBanner,
                recommendStatus: 2,
                recommendAdPicture: this.otherForm.bannerImageUrl,
                listPicture: this.otherForm.thumImageUrl,
                infoPicture: this.otherForm.detailImageUrl,
                skuList: this.otherForm.dynamicValidateForm.domains,
                deleteSkuList: this.otherForm.skuCodeArr,
                id: this.goodId
            };

            console.log('修改/添加时的值', data);

            if (this.isUpdate) {
                this.updateGoodsAjaxPost(data); //修改商品请求
            } else {
                this.addGoodsAjaxPost(data); //添加商品请求
            }
        },

        //添加/修改会员卡
        setVipCardInfo() {
            let data = {
                type: this.activeNum,
                name: this.vipCardForm.name,
                goodsSort: this.vipCardForm.weight,
                synopsis: this.vipCardForm.desc,
                originalPrice: this.vipCardForm.integral,
                presentPrice: this.vipCardForm.nowPrice,
                recommendAdStatus: this.vipCardForm.checkedBanner,
                recommendStatus: 2,
                recommendAdPicture: this.vipCardForm.bannerImageUrl,
                listPicture: this.vipCardForm.thumImageUrl,
                infoPicture: this.vipCardForm.detailImageUrl,
                id: this.goodId
            };

            console.log('修改/添加时的值', data);

            if (this.isUpdate) {
                this.updateGoodsAjaxPost(data); //修改商品请求
            } else {
                this.addGoodsAjaxPost(data); //添加商品请求
            }
        },

        //操作成功时的复原
        successRecover() {
            this.goodId = '';
            this.activeName = '';
            this.activeNum = '';
            this.dialogVisible = false;
            this.isUpdate = false;
        },

        //操作失败时的复原
        // errorRecover() {
        //     this.goodId = '';
        //     this.activeName = 'combo';
        //     this.activeNum = 1;
        // },

        //添加商品请求
        addGoodsAjaxPost(data) {
            this.$post('/api/merchant/store/goods/save', data).then((res) => {
                if (res.code == 0) {
                    this.getGoodsInfo();
                    this.$message.success('添加成功');
                    this.successRecover();
                } else {
                    console.log('添加失败');
                    this.$message.error(res.msg);
                }
            });
        },

        //修改商品请求
        updateGoodsAjaxPost(data) {
            this.$put('/api/merchant/store/goods/update', data).then((res) => {
                if (res.code == 0) {
                    this.getGoodsInfo();
                    this.$message.success('修改成功');
                    this.successRecover();
                    console.log('修改成功');
                } else {
                    console.log('修改失败');
                    this.$message.error(res.msg);
                }
            });
        },

        //商品编辑
        handleEdit(id) {
            this.$get(`/api/merchant/store/goods/getGoodsInfo/${id}`).then((res) => {
                if (res.code == 0) {
                    this.isUpdate = true;
                    this.goodId = id;
                    this.activeNum = res.data.type;

                    switch (res.data.type) {
                        case 1:
                            this.activeName = 'combo';
                            this.sendComoboForm(res.data);
                            break;
                        case 2:
                            this.activeName = 'drinks';
                            this.sendDrinksForm(res.data);
                            break;
                        case 3:
                            this.activeName = 'snack';
                            this.sendSnacksForm(res.data);
                            break;
                        case 4:
                            this.activeName = 'other';
                            this.sendOtherForm(res.data);
                            break;
                        case 5:
                            this.activeName = 'vipCard';
                            this.sendVipCardForm(res.data);
                            break;
                    }
                }
            });
        },

        //对话框里的确定按钮
        handleSure() {
            switch (this.activeName) {
                case 'combo':
                    this.setComboInfo();
                    break;
                case 'drinks':
                    this.setDrinksInfo();
                    break;
                case 'snack':
                    this.setSnackInfo();
                    break;
                case 'other':
                    this.setOtherInfo();
                    break;
                case 'vipCard':
                    this.setVipCardInfo();
                    break;
            }
        },

        //标签页切换事件
        handleClick(tab, event) {
            this.activeNum = Number(tab.index) + 1;
        },

        //传值给套餐子组件
        sendComoboForm(data) {
            this.comboForm.name = data.name;
            this.comboForm.weight = data.goodsSort;
            this.comboForm.desc = data.synopsis;
            this.comboForm.originPrice = data.originalPrice;
            this.comboForm.nowPrice = data.presentPrice;
            this.comboForm.checkedBanner = data.recommendAdStatus == 1 ? (data.recommendAdStatus = true) : (data.recommendAdStatus = false);
            this.comboForm.bannerImageUrl = data.recommendAdPicture;
            this.comboForm.thumImageUrl = data.listPicture;
            this.comboForm.detailImageUrl = data.infoPicture;
            this.comboForm.tableData = data.setMealGoodsList;

            let goodsIdArr = [];
            data.setMealGoodsList.forEach((item) => {
                goodsIdArr.push(item.goodsId);
            });

            this.comboForm.goodsIdList = goodsIdArr;
            this.dialogVisible = true;
        },

        //传值给酒水子组件
        sendDrinksForm(data) {
            this.drinksForm.name = data.name;
            this.drinksForm.goodWeight = data.goodsSort;
            this.drinksForm.desc = data.synopsis;
            this.drinksForm.originPrice = data.originalPrice;
            this.drinksForm.nowPrice = data.presentPrice;
            this.drinksForm.checkedBanner =
                data.recommendAdStatus == 1 ? (data.recommendAdStatus = true) : (data.recommendAdStatus = false);
            this.drinksForm.checkedReco = data.recommendStatus == 1 ? (data.recommendStatus = true) : (data.recommendStatus = false);
            this.drinksForm.classify = data.category;
            this.drinksForm.recoWeight = data.recommendPictureSort;
            this.drinksForm.bannerImageUrl = data.recommendAdPicture;
            this.drinksForm.recoImageUrl = data.recommendPicture;
            this.drinksForm.thumImageUrl = data.listPicture;
            this.drinksForm.detailImageUrl = data.infoPicture;
            this.drinksForm.dynamicValidateForm.domains = data.skuList;
            this.dialogVisible = true;

            console.log('2', this.drinksForm.bannerImageUrl);
        },

        //传值给小吃子组件
        sendSnacksForm(data) {
            this.snackForm.name = data.name;
            this.snackForm.weight = data.goodsSort;
            this.snackForm.desc = data.synopsis;
            this.snackForm.originPrice = data.originalPrice;
            this.snackForm.nowPrice = data.presentPrice;
            this.snackForm.checkedBanner = data.recommendAdStatus == 1 ? (data.recommendAdStatus = true) : (data.recommendAdStatus = false);
            this.snackForm.bannerImageUrl = data.recommendAdPicture;
            this.snackForm.thumImageUrl = data.listPicture;
            this.snackForm.detailImageUrl = data.infoPicture;
            this.snackForm.dynamicValidateForm.domains = data.skuList;
            this.dialogVisible = true;
        },

        //传值给其他子组件
        sendOtherForm(data) {
            this.otherForm.name = data.name;
            this.otherForm.weight = data.goodsSort;
            this.otherForm.desc = data.synopsis;
            this.otherForm.originPrice = data.originalPrice;
            this.otherForm.nowPrice = data.presentPrice;
            this.otherForm.checkedBanner = data.recommendAdStatus == 1 ? (data.recommendAdStatus = true) : (data.recommendAdStatus = false);
            this.otherForm.bannerImageUrl = data.recommendAdPicture;
            this.otherForm.thumImageUrl = data.listPicture;
            this.otherForm.detailImageUrl = data.infoPicture;
            this.otherForm.dynamicValidateForm.domains = data.skuList;
            this.dialogVisible = true;
        },

        //传值给会员卡子组件
        sendVipCardForm(data) {
            this.vipCardForm.name = data.name;
            this.vipCardForm.weight = data.goodsSort;
            this.vipCardForm.desc = data.synopsis;
            this.vipCardForm.integral = data.originalPrice;
            this.vipCardForm.nowPrice = data.presentPrice;
            this.vipCardForm.checkedBanner =
                data.recommendAdStatus == 1 ? (data.recommendAdStatus = true) : (data.recommendAdStatus = false);
            this.vipCardForm.bannerImageUrl = data.recommendAdPicture;
            this.vipCardForm.thumImageUrl = data.listPicture;
            this.vipCardForm.detailImageUrl = data.infoPicture;
            this.dialogVisible = true;
        },

        //单个商品删除
        handleDelete(id) {
            this.$confirm('确认要删除此商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$Delete(`/api/merchant/store/goods/deleteById/${id}`).then((res) => {
                        if (res.code == 0) {
                            this.getGoodsInfo();
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },

        //获取所有商品信息
        getGoodsInfo() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                type: this.value,
                name: this.searchName
            };
            this.$post('/api/merchant/store/goods/goodsLimit', data).then((res) => {
                this.goodsData = res.data.list;
                console.log(this.goodsData);
            });
        },

        //清空所有表单
        clearAllForm() {
            this.clearComboForm();
            this.clearDrinksForm();
            this.clearSnackForm();
            this.clearOtherForm();
            this.clearVipCardForm();
        },

        //清空套餐表单
        clearComboForm() {
            this.comboForm.name = '';
            this.comboForm.weight = 0;
            this.comboForm.desc = '';
            this.comboForm.originPrice = '';
            this.comboForm.nowPrice = '';
            this.comboForm.checkedBanner = false;
            this.comboForm.bannerImageUrl = '';
            this.comboForm.thumImageUrl = '';
            this.comboForm.detailImageUrl = '';
            this.comboForm.tableData = [];
            this.comboForm.goodsIdList = [];
        },

        //清空酒水表单
        clearDrinksForm() {
            this.drinksForm.name = '';
            this.drinksForm.desc = '';
            this.drinksForm.originPrice = '';
            this.drinksForm.nowPrice = '';
            this.drinksForm.checkedBanner = false;
            this.drinksForm.checkedReco = false;
            this.drinksForm.goodWeight = 0;
            this.drinksForm.recoWeight = 0;
            this.drinksForm.classify = 1;
            this.drinksForm.bannerImageUrl = '';
            this.drinksForm.recoImageUrl = '';
            this.drinksForm.thumImageUrl = '';
            this.drinksForm.detailImageUrl = '';
            this.drinksForm.dynamicValidateForm.domains = [
                {
                    spec: '', //规格
                    originPrice: '', //规格原价
                    nowPrice: '' //规格现价
                }
            ];
            this.drinksForm.skuCodeArr = [];
        },

        //清空小吃表单
        clearSnackForm() {
            this.snackForm.name = '';
            this.snackForm.weight = 0;
            this.snackForm.desc = '';
            this.snackForm.originPrice = '';
            this.snackForm.nowPrice = '';
            this.snackForm.checkedBanner = false;
            this.snackForm.bannerImageUrl = '';
            this.snackForm.thumImageUrl = '';
            this.snackForm.detailImageUrl = '';
            this.snackForm.dynamicValidateForm.domains = [
                {
                    spec: '', //规格
                    originPrice: '', //规格原价
                    nowPrice: '' //规格现价
                }
            ];
            this.snackForm.skuCodeArr = [];
        },

        //清空其他表单
        clearOtherForm() {
            this.otherForm.name = '';
            this.otherForm.weight = 0;
            this.otherForm.desc = '';
            this.otherForm.originPrice = '';
            this.otherForm.nowPrice = '';
            this.otherForm.checkedBanner = false;
            this.otherForm.bannerImageUrl = '';
            this.otherForm.thumImageUrl = '';
            this.otherForm.detailImageUrl = '';
            this.otherForm.dynamicValidateForm.domains = [
                {
                    spec: '', //规格
                    originPrice: '', //规格原价
                    nowPrice: '' //规格现价
                }
            ];
            this.otherForm.skuCodeArr = [];
        },

        //清空会员卡表单
        clearVipCardForm() {
            this.vipCardForm.name = '';
            this.vipCardForm.weight = 0;
            this.vipCardForm.desc = '';
            this.vipCardForm.integral = '';
            this.vipCardForm.nowPrice = '';
            this.vipCardForm.checkedBanner = false;
            this.vipCardForm.bannerImageUrl = '';
            this.vipCardForm.thumImageUrl = '';
            this.vipCardForm.detailImageUrl = '';
        },

        //接收套餐传值
        getChildComboForm(data) {
            this.comboForm.name = data.name;
            this.comboForm.weight = Number(data.weight);
            this.comboForm.desc = data.desc;
            this.comboForm.originPrice = data.originPrice;
            this.comboForm.nowPrice = data.nowPrice;
            this.comboForm.checkedBanner =
                data.checkedBanner == true ? (this.comboForm.checkedBanner = 1) : (this.comboForm.checkedBanner = 2);
            this.comboForm.bannerImageUrl = data.bannerImageUrl;
            this.comboForm.thumImageUrl = data.thumImageUrl;
            this.comboForm.detailImageUrl = data.detailImageUrl;
            this.comboForm.tableData = data.tableData;
        },

        //接收酒水传值
        getChildDrinksForm(data) {
            this.drinksForm.name = data.name;
            this.drinksForm.desc = data.desc;
            this.drinksForm.originPrice = data.originPrice;
            this.drinksForm.nowPrice = data.nowPrice;
            this.drinksForm.checkedBanner =
                data.checkedBanner == true ? (this.comboForm.checkedBanner = 1) : (this.comboForm.checkedBanner = 2);
            this.drinksForm.checkedReco = data.checkedReco == true ? (this.comboForm.checkedReco = 1) : (this.comboForm.checkedReco = 2);
            this.drinksForm.classify = data.classify;
            this.drinksForm.goodWeight = Number(data.goodWeight);
            this.drinksForm.recoWeight = Number(data.recoWeight);
            this.drinksForm.bannerImageUrl = data.bannerImageUrl;
            this.drinksForm.recoImageUrl = data.recoImageUrl;
            this.drinksForm.thumImageUrl = data.thumImageUrl;
            this.drinksForm.detailImageUrl = data.detailImageUrl;
            this.drinksForm.dynamicValidateForm = data.dynamicValidateForm;
            this.drinksForm.skuCodeArr = data.skuCodeArr;
        },

        //接收小吃传值
        getChildSnackForm(data) {
            this.snackForm.name = data.name;
            this.snackForm.weight = Number(data.weight);
            this.snackForm.desc = data.desc;
            this.snackForm.originPrice = data.originPrice;
            this.snackForm.nowPrice = data.nowPrice;
            this.snackForm.checkedBanner =
                data.checkedBanner == true ? (this.snackForm.checkedBanner = 1) : (this.snackForm.checkedBanner = 2);
            this.snackForm.bannerImageUrl = data.bannerImageUrl;
            this.snackForm.thumImageUrl = data.thumImageUrl;
            this.snackForm.detailImageUrl = data.detailImageUrl;
            this.snackForm.dynamicValidateForm = data.dynamicValidateForm;
            this.snackForm.skuCodeArr = data.skuCodeArr;
        },

        //接收其他传值
        getChildOtherForm(data) {
            this.otherForm.name = data.name;
            this.otherForm.weight = Number(data.weight);
            this.otherForm.desc = data.desc;
            this.otherForm.originPrice = data.originPrice;
            this.otherForm.nowPrice = data.nowPrice;
            this.otherForm.checkedBanner =
                data.checkedBanner == true ? (this.otherForm.checkedBanner = 1) : (this.otherForm.checkedBanner = 2);
            this.otherForm.bannerImageUrl = data.bannerImageUrl;
            this.otherForm.thumImageUrl = data.thumImageUrl;
            this.otherForm.detailImageUrl = data.detailImageUrl;
            this.otherForm.dynamicValidateForm = data.dynamicValidateForm;
            this.otherForm.skuCodeArr = data.skuCodeArr;
        },

        //接收会员卡传值
        getChildVipCardForm(data) {
            this.vipCardForm.name = data.name;
            this.vipCardForm.weight = Number(data.weight);
            this.vipCardForm.desc = data.desc;
            this.vipCardForm.integral = data.integral;
            this.vipCardForm.nowPrice = data.nowPrice;
            this.vipCardForm.checkedBanner =
                data.checkedBanner == true ? (this.vipCardForm.checkedBanner = 1) : (this.vipCardForm.checkedBanner = 2);
            this.vipCardForm.bannerImageUrl = data.bannerImageUrl;
            this.vipCardForm.thumImageUrl = data.thumImageUrl;
            this.vipCardForm.detailImageUrl = data.detailImageUrl;
        }
    },

    mounted() {
        this.getGoodsInfo(); //请求首页数据
    }
};
</script>

<style>
.goods-info-box .el-textarea__inner {
    resize: none !important;
    height: 84px;
}

.clearfix::after {
    content: '';
    display: block;
    clear: both;
}

.el-upload--picture-card {
    background-color: #fff;
}

.page {
    text-align: right;
    margin-top: 20px;
}

.left-handle {
    float: left;
}

.head-handle {
    margin-bottom: 30px;
}

.handle-input {
    width: 170px;
    display: inline-block;
}

.mr10 {
    margin-right: 10px;
}

.right-handle {
    float: right;
}

.goodsList {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
}

.goods-box {
    box-sizing: border-box;
    width: 12.5%;
    margin-bottom: 30px;
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.el-dialog {
    width: 70%;
}

.banner-box {
    /* margin-right: 60px; */
    width: 60%;
}

.el-form-item__content {
    margin-left: 0 !important;
    margin-bottom: 10px !important;
}

.goods-box .goods-detail {
    width: 90%;
}

.goods-box .goods-detail > h4 {
    font-size: 14px;
    margin: 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.goods-box .goods-detail .goods-price {
    font-size: 13px;
    margin-bottom: 8px;
}

.goods-box .goods-detail .goods-price > span {
    margin-right: 6px;
}

.goods-box > img {
    width: 90%;
    height: 180px;
}

.goods-box .goods-detail .goods-handle {
    display: flex;
    justify-content: space-around;
}

.goods-box .goods-detail .goods-handle .el-button--small,
.el-button--small.is-round {
    padding: 9px 24px;
}

.el-dialog__header {
    padding: 0 !important;
}

.add-classify-title {
    display: flex;
    align-items: center;
}

.add-classify-title::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    margin-right: 10px;
    background-color: #999;
}

.add-classify-title.goods-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    /* margin: 30px 0; */
}

.goods-info-box {
    /* border: 1px solid black; */
    display: flex;
    /* justify-content: space-between; */
}

.goods-info-box .left-box {
    /* margin-right: 100px; */
    width: 70%;
    /* border: 1px solid black; */
}

.goods-info-box .left-box.drinks {
    /* margin-right: 100px; */
    width: 70%;
    /* border: 1px solid black; */
}

.goods-info-box p {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.goods-info-box .good-name-box {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.goods-info-box .good-name-box > div:first-child {
    margin-right: 20px;
}

.goods-info-box p > span {
    margin-right: 10px;
    /* float: left; */
    /* color: #f00; */
}

.goods-info-box p > i {
    display: inline-block;
    font-style: normal;
    text-align: center;
    line-height: 30px;
    width: 60px;
    height: 30px;
    border-radius: 5px;
    margin-right: 10px;
    /* border: 1px solid #ddd; */
    background-color: #999;
    color: #fff;
}

.combo-spec {
    width: 90%;
    /* border: 1px solid black; */
}

.drinks-spec .el-form-item {
    /* display: flex;
    align-items: center; */
    margin-bottom: 0px;
}

.drinks-update {
    display: flex;
    justify-content: space-between;
}

/* .drinks-check {
    display: flex;
    flex-direction: column;
    
} */

.goods-info-box .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.goods-info-box .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.goods-info-box .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
}

.goods-info-box .avatar {
    width: 140px;
    height: 140px;
    display: block;
}

.goods-info-box .el-upload--text {
    width: 140px !important;
    height: 140px !important;
}

.drinks-update-box {
    display: flex;
}

.drinks-update-box div .drinks-div {
    margin-top: 20px;
}
</style>