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
                <el-dialog :visible.sync="dialogVisible" class="add-goods-dialog">
                    <!-- <span class="add-classify-title">选择添加种类</span> -->
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!-- 套餐标签页 -->
                        <el-tab-pane label="套餐" name="combo">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <combo-tab
                                :comboFormParent="comboForm"
                                @comboFormChild="getChildComboForm"
                            ></combo-tab>
                        </el-tab-pane>

                        <!-- 酒水标签页 -->
                        <el-tab-pane label="酒水" name="drinks">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <drinks-tab></drinks-tab>
                        </el-tab-pane>

                        <!-- 小吃标签页 -->
                        <el-tab-pane label="小吃" name="snack">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <snack-tab></snack-tab>
                        </el-tab-pane>

                        <!-- 其他标签页 -->
                        <el-tab-pane label="其他" name="other">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <other-tab></other-tab>
                        </el-tab-pane>

                        <!-- 会员卡标签页 -->
                        <el-tab-pane label="会员卡" name="vipCard">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <vip-card-tab></vip-card-tab>
                        </el-tab-pane>
                    </el-tabs>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="handleCancel">取 消</el-button>
                        <el-button type="primary" @click="handleSure">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 右边操作区域 -->
                <div class="right-handle">
                    <el-input v-model="searchName" placeholder="商品名称" class="handle-input mr10"></el-input>
                    <el-select v-model="value" placeholder="选择分类" class="mr10" style="width:100px">
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

            <!-- 中间区域 -->
            <div class="goodsList">
                <div class="goods-box">
                    <img src="img/2.jpg" alt />
                    <div class="goods-detail">
                        <h4 title="商品名称">商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/3.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/4.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/5.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/6.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/2.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/2.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/2.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/2.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="goods-box">
                    <img src="img/5.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary" @click="handleEdit">编辑</el-button>
                            <el-button type="danger" @click="handleDelete">删除</el-button>
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
            searchName: '', //商品名称输入框
            value: '', //商品酒水分类下拉框

            dialogVisible: false, //添加商品的对话框
            activeName: 'combo', //默认展示的标签页
            activeNum: 1, //标签页对应的下标，默认为1

            // 表格数据分页相关属性
            dataListCount: 100, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 16, //默认每页要显示多少条数据

            //套餐标签页表单---------------------------------
            comboForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false,

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //酒水标签页表单-----------------------------------------
            drinksForm: {
                name: '',
                classify: '',
                classifyOptions: [
                    {
                        label: '啤酒',
                        value: '啤酒'
                    },
                    {
                        label: '香槟',
                        value: '香槟'
                    },
                    {
                        label: '饮料',
                        value: '饮料'
                    },
                    {
                        label: '矿泉水',
                        value: '矿泉水'
                    }
                ],
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                checkedReco: false,
                weight: '',
                options: [
                    {
                        label: '0',
                        value: '0'
                    },
                    {
                        label: '1',
                        value: '1'
                    },
                    {
                        label: '2',
                        value: '2'
                    },
                    {
                        label: '3',
                        value: '3'
                    }
                ],

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },
            //酒水新增规格
            dynamicValidateForm: {
                domains: [
                    {
                        spec: '', //规格
                        price: '' //规格价格
                    }
                ]
            },

            //小吃标签页表单------------------------------------------
            snackForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['小份', '中份', '大份'],
                checkedBanner: false,

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //其他标签页表单--------------------------------------------
            otherForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['1份', '1盒'],
                checkedBanner: false,

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //会员卡标签页表单--------------------------------------------
            vipCardForm: {
                name: '',
                desc: '',
                integral: '', //积分
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false,

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //商品分类下拉框
            options: [
                {
                    label: '红酒',
                    value: '1'
                },
                {
                    label: '白酒',
                    value: '2'
                },
                {
                    label: '啤酒',
                    value: '3'
                },
                {
                    label: '香槟',
                    value: '4'
                },
                {
                    label: '洋酒',
                    value: '5'
                },
                {
                    label: '调制酒',
                    value: '6'
                },
                {
                    label: '饮料',
                    value: '7'
                }
            ]
        };
    },

    methods: {
        //获取子组件传过来的表单值
        getChildComboForm(data) {
            console.log(data);
            this.comboForm.name = data.name;
            this.comboForm.weight = data.weight;
            this.comboForm.desc = data.desc;
            this.comboForm.originPrice = data.originPrice;
            this.comboForm.nowPrice = data.nowPrice;
            this.comboForm.checkedBanner =
                data.checkedBanner == true ? (this.comboForm.checkedBanner = 1) : (this.comboForm.checkedBanner = 2);
            this.comboForm.bannerImgBox = data.bannerImgBox;
            this.comboForm.bannerUploadUrl = data.bannerUploadUrl;
            this.comboForm.thumImageUrl = data.thumImageUrl;
            this.comboForm.detailImageUrl = data.detailImageUrl;
        },

        //翻页
        handleCurrentChange(val) {
            this.currentPage = val; //将当前跳转的页码赋给显在页面上的页码
            this.getGoodsInfo({ pageNo: this.currentPage }); //请求翻页后的数据
        },

        // //酒水规格添加按钮
        // addDomain() {
        //     this.dynamicValidateForm.domains.push({
        //         spec: '',
        //         price: ''
        //     });
        // },

        // //酒水规格删除按钮
        // removeDomain(item) {
        //     var index = this.dynamicValidateForm.domains.indexOf(item);
        //     if (index !== -1) {
        //         this.dynamicValidateForm.domains.splice(index, 1);
        //     }
        // },

        //搜索按钮
        handleSearch() {
            this.getGoodsInfo({ category: this.value, name: this.searchName });
            this.searchName = '';
            this.value = '';
        },

        //添加商品
        handleAdd() {
            this.dialogVisible = true;
        },

        //添加商品对话框里的取消按钮
        handleCancel() {
            this.dialogVisible = false;
        },

        //添加套餐-------------------------------------------------------
        setComboInfo() {
            let data = {
                type: this.activeNum,
                name: this.comboForm.name,
                goodsSort: this.comboForm.weight,
                goodsSort: 0,
                synopsis: this.comboForm.desc,
                originalPrice: this.comboForm.originPrice,
                presentPrice: this.comboForm.nowPrice,
                recommendAdStatus: this.comboForm.checkedBanner,
                recommendStatus: 2,
                recommendAdPicture: this.comboForm.bannerUploadUrl,
                listPicture: this.comboForm.thumImageUrl,
                infoPicture: this.comboForm.detailImageUrl
            };
            this.$post('/dev/merchant/store/goods/save', data).then((res) => {
                console.log(res);
            });
        },

        //添加酒水----------------------------------
        setDrinksInfo() {},

        //添加小吃-----------------------------------
        setSnackInfo() {},

        //添加其他----------------------------------
        setOtherInfo() {},

        //添加会员卡----------------------------------
        setVipCardInfo() {},

        //添加商品对话框里的确定按钮
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
                case 'vipCard':
                    this.setVipCardInfo();
            }
            this.dialogVisible = false;
        },

        //标签页切换事件
        handleClick(tab, event) {
            this.activeNum = Number(tab.index) + 1;
            console.log(this.activeNum);
            console.log(this.activeName);
        },

        //批量删除
        handleDelAll() {},

        //商品编辑
        handleEdit() {},

        //商品删除
        handleDelete() {
            let id = '1299275571139633153';
            this.$confirm('确认要删除此商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$Delete(`/merchant/store/goods/deleteById/${id}`).then((res) => {
                        console.log(res);
                        this.$message.success('删除成功');
                    });
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        //获取商品信息
        getGoodsInfo() {
            let data = {
                pageNo: 1,
                pageSize: this.pagesize,
                category: '',
                name: ''
            };
            this.$post('/merchant/store/goods/goodsLimit', data).then((res) => {
                console.log(res);
            });
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

.banner-box {
    margin-right: 60px;
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
    width: 60%;
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

.goods-info-box .good-name-box>div:first-child {
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