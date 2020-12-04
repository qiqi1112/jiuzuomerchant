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
                    <el-button type="primary" icon="el-icon-plus" @click="getAddGoodsTitleSort" style="margin-right: 10px"
                        >添加商品</el-button
                    >
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
                    <el-button type="primary" @click="handleSelGoodsType" class="mr10" v-if="goodsData.length > 0">APP展示选择</el-button>
                    <el-input
                        v-model="searchName"
                        @keydown.13.native="searchGoodsInfo"
                        placeholder="商品名称"
                        class="handle-input mr10"
                        clearable
                    ></el-input>
                    <el-select v-model="value" placeholder="选择分类" class="mr10" style="width: 100px" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="searchGoodsInfo">搜索</el-button>
                </div>
            </div>

            <!-- 操作商品的对话框 -->
            <el-dialog :visible.sync="dialogVisible" @close="handleCancel">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 编辑商品时 -->
                    <el-tab-pane v-if="isUpdate" :label="activeName" :name="activeName"></el-tab-pane>
                    <!-- 新增商品时 -->
                    <el-tab-pane
                        v-else
                        :label="item.typeName"
                        :name="item.typeName"
                        v-for="(item, index) in titleArrList"
                        :key="index"
                    ></el-tab-pane>
                </el-tabs>

                <!-- 标签页组件信息 -->
                <template>
                    <handleShop :goodsForm="goodsForm" :activeNum="activeNum"></handleShop>
                </template>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="setGoodsInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- APP展示商品分类弹窗 -->
            <el-dialog :visible.sync="showTypeDialog" @close="showTypeDialog = false" class="show-type-dialog">
                <span class="add-classify-title">请选择给用户展示的商品种类 <span style="color: #f00">（选中为展示分类）</span></span>

                <el-checkbox v-model="item.hidden" v-for="(item, index) in goodsTypeList" :key="index">{{
                    item.type | showAppGoodsType
                }}</el-checkbox>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="showTypeDialog = false">取 消</el-button>
                    <el-button type="primary" @click="handleSureShowType">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 商品列表 -->
            <div class="goodsList">
                <div class="goods-box" v-for="(item, index) in goodsData" :key="index" @click="selectGoods">
                    <el-checkbox v-if="isSelect" :data-id="item.id" class="checkbox"></el-checkbox>
                    <img :src="showImgPrefix + item.listPicture" alt />
                    <div class="goods-detail">
                        <h4 title="商品名称">{{ item.name }}</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥{{ item.presentPrice }}</span>
                            <s>￥{{ item.originalPrice }}</s>
                        </p>
                        <div class="goods-handle">
                            <el-button type="primary" @click="handleEdit(item.id)">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
                        </div>
                    </div>
                </div>
            </div>

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
    </div>
</template>

<script>
import handleShop from './handleShop';

export default {
    components: {
        handleShop
    },

    data() {
        return {
            showImgPrefix: this.$imgHead, //回显图片前缀
            searchName: '', //商品名称输入框
            value: '', //商品分类下拉框

            dialogVisible: false, //操作商品的对话框开关
            activeName: '', //默认展示的标签页名称
            editActiveName: '', //编辑时展示的标签页

            showTypeDialog: false, //APP展示商品分类开关
            goodsTypeList: [], //该商家已有的商品种类列表
            showTypeList: [], //要展示的商品种类列表

            // 表格数据分页相关属性
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认页码
            pagesize: 16, //默认每页要显示多少条数据

            goodsData: [], //请求到的商品信息数组

            goodId: '', //当前编辑的商品id

            activeNum: '', //标签页对应的下标（种类 1-套餐 2-威士忌 3-白兰地 4-伏特加 5-香槟 6-红酒 7-啤酒 8-鸡尾酒 9-小吃 10-其它 11-会员卡）

            //商品信息
            goodsForm: {
                name: '', //名称
                desc: '', //简介
                originPrice: '', //原价
                nowPrice: '', //现价
                comboNowPrice: '', //套餐现价
                statisticalPrice: '', //会员卡原价
                checkedBanner: false, //商家广告banner位开关
                checkedReco: false, //商家推荐位开关
                area: '', //产地
                year: '', //年份
                goodWeight: 0, //商品排序
                recoWeight: 0, //商家推荐位排序
                bannerImageUrl: '', //广告图
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图
                tableData: [], //套餐中渲染单品数据

                //新增商品规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '', //规格现价
                            statisticalPrice: '', //新增的现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [], //要删除的规格id数组
                goodsIdList: [] //所有已选择的商品对应的id
            },

            //商品分类下拉框
            options: [
                {
                    label: '套餐 ',
                    value: 1
                },
                {
                    label: '威士忌',
                    value: 2
                },
                {
                    label: '白兰地',
                    value: 3
                },
                {
                    label: '伏特加',
                    value: 4
                },
                {
                    label: '香槟',
                    value: 5
                },
                {
                    label: '红酒',
                    value: 6
                },
                {
                    label: '啤酒',
                    value: 7
                },
                {
                    label: '鸡尾酒',
                    value: 8
                },
                {
                    label: '小吃',
                    value: 9
                },
                {
                    label: '其它',
                    value: 10
                },
                {
                    label: '会员卡',
                    value: 11
                }
            ],

            isUpdate: false, //是否为修改操作
            isSelect: false, //是否要批量删除
            deleteSelect: [], //批量删除的数组
            requestStatus: true, //请求时的防抖标杆

            wrapLoading: false, //加载开关

            titleArrList: [] //标签页标题信息
        };
    },

    methods: {
        //搜索操作
        searchGoodsInfo() {
            this.currentPage = 1;
            this.getGoodsInfo(); //请求数据
        },

        //APP展示选择按钮
        handleSelGoodsType() {
            this.$get('/merchant/store/goods/hiddenList').then((res) => {
                if (res.code === 0) {
                    this.showTypeDialog = true;
                    this.goodsTypeList = res.data;
                }
            });
        },

        //要展示的商品分类弹窗中的确认按钮
        handleSureShowType() {
            let data = {
                hiddenDTOS: this.goodsTypeList
            };

            this.$post('/merchant/store/goods/updateHidden', data).then((res) => {
                if (res.code === 0) {
                    this.$message.success('修改成功');
                    this.showTypeDialog = false;
                }
            });
        },

        //翻页操作
        handleCurrentChange(val) {
            this.currentPage = val; //将当前跳转的页码赋给显在页面上的页码

            //防抖请求
            if (this.requestStatus) {
                this.requestStatus = false;
                this.getGoodsInfo(); //请求翻页后的数据
            }
        },

        //批量删除选中操作
        selectGoods(e) {
            if (e.target.nodeName == 'INPUT') {
                //将当前选中的商品的id加入到数组中
                let id = e.target.parentNode.parentNode.dataset.id;
                if (e.target.checked) {
                    this.deleteSelect.push(id);
                } else {
                    //从数组中删除当前商品id
                    let delId = this.deleteSelect.indexOf(id);
                    this.deleteSelect.splice(delId, 1);
                }
            }
        },

        //确认删除选择的商品
        sureDelAll() {
            if (this.deleteSelect.length > 0) {
                this.$confirm('确认要删除所选商品吗?', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$post('/merchant/store/goods/batchDeleteGoods', this.deleteSelect).then((res) => {
                            if (res.code === 0) {
                                this.getGoodsInfo();
                                this.$message.success('删除成功');
                            } else {
                                this.$message.error(res.msg);
                            }
                            this.cancelDelete();
                            console.log(res);
                        });
                    })
                    .catch(() => {
                        this.cancelDelete();
                    });
            } else {
                this.$message.error('请选择要删除的商品');
            }
        },

        //添加商品时的操作
        getAddGoodsTitleSort() {
            // 获取添加商品标题排序
            this.$get('/merchant/store/goods/goodsStoreCount').then((res) => {
                if (res.code === 0) {
                    this.titleArrList = res.data;
                    this.activeName = this.titleArrList[0].typeName;
                    this.activeNum = this.titleArrList[0].type;

                    this.isUpdate = false;
                    this.dialogVisible = true;
                } else {
                    this.$message.error(res.msg);
                }
                console.log('标题排序', this.titleArrList);
            });
        },

        //删除商品的初始化操作
        cancelDelete() {
            this.deleteSelect = [];
            this.isSelect = false;
        },

        //关闭对话框操作
        handleCancel() {
            this.goodId = '';
            this.dialogVisible = false;
            this.activeName = '';
            this.activeNum = '';

            this.editActiveName = '';

            this.isUpdate = false;
            this.cancelDelete(); //初始化删除商品相关的操作
            this.clearAllForm(); //清空所有表单
        },

        //清空所有表单
        clearAllForm() {
            this.goodsForm = {
                name: '', //名称
                desc: '', //简介
                originPrice: '', //原价
                nowPrice: '', //现价
                comboNowPrice: '', //套餐现价
                statisticalPrice: '', //会员卡原价
                checkedBanner: false, //商家广告banner位开关
                checkedReco: false, //商家推荐位开关
                area: '', //产地
                year: '', //年份
                goodWeight: 0, //商品排序
                recoWeight: 0, //商家推荐位排序
                bannerImageUrl: '', //广告图
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图
                tableData: [], //套餐中渲染单品数据
                goodsIdList: [], //所有已选择的商品对应的id

                //新增商品规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '', //规格现价
                            statisticalPrice: '', //新增的现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [] //要删除的规格id数组
            };
        },

        //标签页切换事件
        handleClick(tab, event) {
            //获取当前点击的标签页所对应的接口里的种类下标
            this.titleArrList.forEach((item) => {
                if (item.typeName == tab.name) {
                    this.activeNum = item.type;
                }
            });

            console.log('切换标签页操作', this.activeNum, this.activeName);

            this.clearAllForm();
        },

        //单个商品删除
        handleDelete(id) {
            this.$confirm('确认要删除此商品吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$Delete(`/merchant/store/goods/deleteById/${id}`).then((res) => {
                        if (res.code === 0) {
                            this.getGoodsInfo(); //重新请求数据
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                })
                .catch(() => {});
        },

        //获取所有商品信息
        getGoodsInfo() {
            this.wrapLoading = true;
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                type: this.value,
                name: this.searchName
            };
            this.$post('/merchant/store/goods/goodsLimit', data).then((res) => {
                if (res.code === 0) {
                    this.dataListCount = res.data.total; //总数据条数
                    this.goodsData = res.data.list; //所有数据
                    this.requestStatus = true; //防抖开关
                    this.wrapLoading = false;
                }
            });
        },

        //添加/修改商品
        setGoodsInfo(active) {
            if (this.activeNum != 1 && this.activeNum != 11) {
                this.goodsForm.originPrice = this.getMinVal(); //计算规格中最小的原价
            }

            let data = {
                listPicture: this.goodsForm.thumImageUrl,
                name: this.goodsForm.name,
                originalPrice: this.goodsForm.originPrice,
                recommendAdStatus:
                    this.goodsForm.checkedBanner === true ? (this.goodsForm.checkedBanner = 1) : (this.goodsForm.checkedBanner = 2),
                recommendStatus: this.goodsForm.checkedReco == true ? (this.goodsForm.checkedReco = 1) : (this.goodsForm.checkedReco = 2),
                synopsis: this.goodsForm.desc,
                type: this.activeNum,
                area: this.goodsForm.area,
                deleteSkuList: this.goodsForm.skuCodeArr,
                goodsSort: this.goodsForm.goodWeight,
                id: this.goodId,
                infoPicture: this.goodsForm.detailImageUrl,
                presentPrice: this.goodsForm.nowPrice,
                // statisticalPrice: this.goodsForm.statisticalPrice,
                recommendAdPicture: this.goodsForm.bannerImageUrl,
                recommendPicture: this.goodsForm.recoImageUrl,
                recommendPictureSort: this.goodsForm.recoWeight,
                setMealGoodsList: this.goodsForm.tableData,
                skuList: this.goodsForm.dynamicValidateForm.domains,
                statisticalPrice:
                    this.activeNum == 1 ? this.goodsForm.comboNowPrice : this.activeNum == 11 ? this.goodsForm.statisticalPrice : '',
                year: this.goodsForm.year
            };

            console.log(data);
            // 判断传商品价格开关
            let commodityPrice = true;
            let commodityPicture = true;
            let skuSwitch = true;
            // console.log(data)
            if (!data.name) {
                this.$message.warning('请输入商品名称');
                return;
            }

            if (this.goodsForm.checkedBanner == 1 && !data.recommendAdPicture) {
                this.$message.warning('请添加广告图片');
                this.goodsForm.checkedBanner = false;
                return;
            }
            if (this.goodsForm.checkedReco == 1 && !data.recommendPicture) {
                this.$message.warning('请添加推荐位图片');
                this.goodsForm.checkedReco = false;
                return;
            }
            if (this.activeNum == 1) {
                if (!data.listPicture) {
                    this.$message.warning('请添加商品缩略图');
                    return;
                }
                if (!data.infoPicture) {
                    this.$message.warning('请添加商品详情图');
                    return;
                }
                if (data.setMealGoodsList.length == 0) {
                    this.$message.warning('请至少选择一件商品');
                    commodityPrice = false;
                }
                if (!this.$regular.money(data.statisticalPrice)) {
                    this.$message.warning('请输入保留两位的数字的价格');
                    return;
                }
                if (Number(data.statisticalPrice) > Number(data.originalPrice)) {
                    this.$message.warning('商品现价大于原价');
                    commodityPrice = false;
                }
                if (commodityPrice) {
                    this.upCommodity(data);
                }
            } else if (this.activeNum == 11) {
                if (!this.$regular.money(data.originalPrice)) {
                    this.$message.warning('请输入纯数字积分');
                    return;
                }
                if (!this.$regular.money(data.presentPrice)) {
                    this.$message.warning('请输入保留两位的数字的价格');
                    return;
                }
                if (!data.listPicture) {
                    this.$message.warning('请至少选择一张商品缩略图');
                    commodityPicture = false;
                }
                if (commodityPicture) {
                    this.upCommodity(data);
                }
            } else {
                // 判断传没传商品规格的开关;
                if (!data.listPicture) {
                    this.$message.warning('请添加商品缩略图');
                    return;
                }
                if (!data.infoPicture) {
                    this.$message.warning('请添加商品详情图');
                    return;
                }
                if (!this.$regular.money(data.originalPrice)) {
                    this.$message.warning('请输入保留两位的数字的价格');
                    return;
                }
                data.skuList.map((item) => {
                    if (!item.specName || !item.originalPrice || !item.statisticalPrice) {
                        this.$message.warning('请输入商品规格');
                        skuSwitch = false;
                    }
                });
                if (skuSwitch) {
                    this.upCommodity(data);
                }
            }
        },
        upCommodity(result) {
            (async () => {
                if (this.isUpdate) {
                    const res = await this.$put('/merchant/store/goods/update', result);
                    if (res.code === 0) {
                        this.getGoodsInfo();
                        this.handleCancel();
                        this.$message.success('修改成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                } else {
                    const res = await this.$post('/merchant/store/goods/save', result);
                    console.log(res);
                    if (res.code === 0) {
                        this.getGoodsInfo();
                        this.handleCancel();
                        this.$message.success('添加成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                }
            })();
        },

        //商品编辑
        handleEdit(id) {
            this.$get(`/merchant/store/goods/getGoodsInfo/${id}`).then((result) => {
                if (result.code === 0) {
                    let res = result.data;

                    this.isUpdate = true; //启用编辑模式
                    this.dialogVisible = true; //对话框打开
                    this.goodId = id; //获取商品操作的ID
                    this.activeNum = res.type; //获取操作的分类下标

                    //根据返回的商品分类下标展示其对应的分类名称
                    this.options.forEach((item) => {
                        if (item.value === res.type) {
                            this.activeName = item.label;
                        }
                    });

                    //商品信息
                    this.goodsForm = {
                        name: res.name, //名称
                        desc: res.synopsis, //简介
                        originPrice: res.originalPrice, //原价
                        nowPrice: res.presentPrice, //现价
                        comboNowPrice: res.statisticalPrice, //套餐现价
                        statisticalPrice: res.statisticalPrice, //会员卡现价
                        checkedBanner: res.recommendAdStatus === 1 ? true : false, //商家广告banner位开关
                        checkedReco: res.recommendStatus === 1 ? true : false, //商家推荐位开关
                        area: res.area, //产地
                        year: res.year, //年份
                        goodWeight: res.goodsSort, //商品排序
                        recoWeight: res.recommendPictureSort, //商家推荐位排序
                        bannerImageUrl: res.recommendAdPicture, //广告图
                        recoImageUrl: res.recommendPicture, //推荐位图
                        thumImageUrl: res.listPicture, //缩略图
                        detailImageUrl: res.infoPicture, //详情图
                        tableData: res.setMealGoodsList, //套餐中渲染单品数据

                        //新增商品规格
                        dynamicValidateForm: {
                            domains: res.skuList
                        },
                        skuCodeArr: res.deleteSkuList, //要删除的规格id数组

                        goodsIdList: res.setMealGoodsList.map((item) => item.goodsId) //套餐的已选择单品ID
                    };
                }
            });
        },

        //获取规格中的原价最小值
        getMinVal() {
            let newArr = this.goodsForm.dynamicValidateForm.domains.map((item) => {
                return item.originalPrice;
            });

            return Math.min(...newArr); //返回最小值
        }
    },

    mounted() {
        this.getGoodsInfo(); //请求首页数据
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

.goodsList {
    display: flex;
    flex-wrap: wrap;
    .goods-box {
        box-sizing: border-box;
        width: 180px;
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-right: 10px;
        .checkbox {
            position: absolute;
            top: -1px;
            right: 5%;
        }

        > img {
            width: 90%;
            height: 180px;
            border-radius: 2px;
        }

        .goods-detail {
            width: 90%;

            > h4 {
                font-size: 14px;
                margin: 8px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .goods-price {
                font-size: 13px;
                margin-bottom: 8px;

                > span {
                    margin-right: 6px;
                }
            }

            .goods-handle {
                display: flex;
                justify-content: space-around;
                // justify-content: space-between;

                .el-button--small,
                .el-button--small.is-round {
                    padding: 9px 24px;
                }
            }
        }
    }
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
    width: 70%;
}

/deep/.el-form-item__content {
    margin-left: 0 !important;
}

/deep/.el-dialog__header {
    padding: 0;
}
</style>