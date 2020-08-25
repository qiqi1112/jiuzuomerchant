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
                    <el-button type="primary" @click="handleAdd">添加商品</el-button>
                    <el-button type="danger" @click="handleDelAll">批量删除</el-button>
                </el-row>

                <!-- 添加商户的对话框 -->
                <el-dialog :visible.sync="dialogVisible" class="add-goods-dialog">
                    <!-- <span class="add-classify-title">选择添加种类</span> -->
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!-- 套餐标签页 -->
                        <el-tab-pane label="套餐" name="combo">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <div class="goods-info-box">
                                <div class="left-box">
                                    <el-form ref="comboForm" :model="comboForm" label-width="80px">
                                        <p>
                                            <span>套餐名称：</span>
                                            <el-input v-model="comboForm.name" style="width:200px"></el-input>
                                        </p>
                                        <p>
                                            <span>套餐包含：</span>
                                            <el-input
                                                type="textarea"
                                                v-model="comboForm.desc"
                                                style="width:300px;"
                                            ></el-input>
                                        </p>
                                        <p>
                                            <span>套餐原单价：</span>
                                            <el-input
                                                v-model="comboForm.originPrice"
                                                style="width:120px;margin-right:20px"
                                            ></el-input>

                                            <span>套餐现单价：</span>
                                            <el-input
                                                v-model="comboForm.nowPrice"
                                                style="width:120px"
                                            ></el-input>
                                        </p>
                                        <p class="combo-spec">
                                            <span>套餐规格：</span>
                                            <i
                                                v-for="(item,index) in comboForm.spec"
                                                :key="index"
                                            >{{item}}</i>
                                        </p>
                                    </el-form>
                                    <p>
                                        <el-checkbox
                                            v-model="comboForm.checkedBanner"
                                            label="放至商店Banner位"
                                            border
                                            style="margin-right:20px"
                                        ></el-checkbox>
                                        <el-select
                                            v-model="drinksForm.weight"
                                            placeholder="Banner位权重"
                                            style="width:140px"
                                        >
                                            <el-option
                                                v-for="item in drinksForm.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </p>
                                    <!-- banner图 -->
                                    <el-upload
                                        class="avatar-uploader"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :show-file-list="false"
                                    >
                                        <img
                                            v-if="comboBannerImageUrl"
                                            :src="comboBannerImageUrl"
                                            class="avatar"
                                        />
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                    <span>（*如需商店轮播推荐，请添加Banner图片）</span>
                                </div>
                                <div class="right-box">
                                    <!-- 缩略图 -->
                                    <p>
                                        <span>套餐缩略图：</span>
                                        <el-upload
                                            class="avatar-uploader"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                        >
                                            <img
                                                v-if="comboThumImageUrl"
                                                :src="comboThumImageUrl"
                                                class="avatar"
                                            />
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </p>
                                    <!-- 详情图 -->
                                    <p>
                                        <span>套餐详情图：</span>
                                        <el-upload
                                            class="avatar-uploader"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                        >
                                            <img
                                                v-if="comboDetailImageUrl"
                                                :src="comboDetailImageUrl"
                                                class="avatar"
                                            />
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </p>
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- 酒水标签页 -->
                        <el-tab-pane label="酒水" name="drinks">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <div class="goods-info-box">
                                <div class="left-box drinks">
                                    <el-form
                                        ref="drinksForm"
                                        :model="drinksForm"
                                        label-width="80px"
                                    >
                                        <p>
                                            <span>酒水名称：</span>
                                            <el-input
                                                v-model="drinksForm.name"
                                                style="width:170px;margin-right:20px"
                                            ></el-input>
                                            <el-select
                                                v-model="drinksForm.classify"
                                                placeholder="酒水分类"
                                                style="width:110px"
                                            >
                                                <el-option
                                                    v-for="item in drinksForm.classifyOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </p>
                                        <p>
                                            <span>酒水包含：</span>
                                            <el-input
                                                type="textarea"
                                                v-model="drinksForm.desc"
                                                style="width:300px;"
                                            ></el-input>
                                        </p>
                                        <p>
                                            <span>酒水原单价：</span>
                                            <el-input
                                                v-model="drinksForm.originPrice"
                                                style="width:120px;margin-right:20px"
                                            ></el-input>

                                            <span>酒水现单价：</span>
                                            <el-input
                                                v-model="drinksForm.nowPrice"
                                                style="width:120px"
                                            ></el-input>
                                        </p>
                                        <p class="combo-spec">
                                            <span>酒水规格：</span>
                                            <i
                                                v-for="(item,index) in drinksForm.spec"
                                                :key="index"
                                            >{{item}}</i>
                                        </p>
                                    </el-form>
                                    <p class="drinks-check">
                                        <el-checkbox
                                            v-model="drinksForm.checkedBanner"
                                            label="放至商店Banner位"
                                            border
                                            style="margin-right:20px"
                                        ></el-checkbox>
                                        <el-select
                                            v-model="drinksForm.weight"
                                            placeholder="Banner位权重"
                                            style="width:140px;margin-right:60px"
                                        >
                                            <el-option
                                                v-for="item in drinksForm.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                        <el-checkbox
                                            v-model="drinksForm.checkedBanner"
                                            label="放至商家推荐位"
                                            border
                                        ></el-checkbox>
                                    </p>
                                    <!-- banner图 -->
                                    <div class="drinks-update">
                                        <div>
                                            <el-upload
                                                class="avatar-uploader"
                                                action="https://jsonplaceholder.typicode.com/posts/"
                                                :show-file-list="false"
                                            >
                                                <img
                                                    v-if="comboBannerImageUrl"
                                                    :src="comboBannerImageUrl"
                                                    class="avatar"
                                                />
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                            <span>（*如需商店轮播推荐，请添加Banner图片）</span>
                                        </div>
                                        <div>
                                            <el-upload
                                                class="avatar-uploader"
                                                action="https://jsonplaceholder.typicode.com/posts/"
                                                :show-file-list="false"
                                            >
                                                <img
                                                    v-if="comboBannerImageUrl"
                                                    :src="comboBannerImageUrl"
                                                    class="avatar"
                                                />
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                            <span>（*如需商店轮播推荐，请添加Banner图片）</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-box">
                                    <!-- 缩略图 -->
                                    <p>
                                        <span>酒水缩略图：</span>
                                        <el-upload
                                            class="avatar-uploader"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                        >
                                            <img
                                                v-if="comboThumImageUrl"
                                                :src="comboThumImageUrl"
                                                class="avatar"
                                            />
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </p>
                                    <!-- 详情图 -->
                                    <p>
                                        <span>酒水详情图：</span>
                                        <el-upload
                                            class="avatar-uploader"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                        >
                                            <img
                                                v-if="comboDetailImageUrl"
                                                :src="comboDetailImageUrl"
                                                class="avatar"
                                            />
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </p>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="小吃" name="snack">
                            <span class="add-classify-title goods-info">商品信息</span>
                        </el-tab-pane>
                        <el-tab-pane label="其他" name="other">
                            <span class="add-classify-title goods-info">商品信息</span>
                        </el-tab-pane>
                        <el-tab-pane label="会员卡" name="vipCard">
                            <span class="add-classify-title goods-info">商品信息</span>
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
                    <img src="img/3.jpg" alt />
                    <div class="goods-detail">
                        <h4>商品名称</h4>
                        <p class="goods-price">
                            售价：
                            <span>￥1576.00</span>
                            <s>￥2099.00</s>
                        </p>
                        <el-row class="goods-handle">
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
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
                            <el-button type="primary">编辑</el-button>
                            <el-button type="primary">删除</el-button>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchName: '', //商品名称输入框
            value: '', //商品分类下拉框

            dialogVisible: false, //添加商品的对话框
            activeName: 'combo', //默认展示的标签页

            //套餐标签页表单---------------------------------
            comboForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                weight: '',
                spec: ['默认'],
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
                ]
            },
            comboBannerImageUrl: '', //套餐banner图
            comboThumImageUrl: '', //套餐缩略图
            comboDetailImageUrl: '', //套餐详情图

            //酒水标签页表单-----------------------------------------
            drinksForm: {
                name: '',
                classify: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                weight: '',
                spec: ['1杯', '1瓶', '1打', '半打', '1箱'],
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
                ]
            },
            drinksBannerImageUrl: '', //酒水banner图
            drinksThumImageUrl: '', //酒水缩略图
            drinksDetailImageUrl: '', //酒水详情图

            //小吃标签页表单------------------------------------------
            snackForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
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
                ]
            },
            snackBannerImageUrl: '', //小吃banner图
            snackThumImageUrl: '', //小吃缩略图
            snackDetailImageUrl: '', //小吃详情图

            //其他标签页表单--------------------------------------------
            otherForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
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
                ]
            },
            otherBannerImageUrl: '', //其他banner图
            otherThumImageUrl: '', //其他缩略图
            otherDetailImageUrl: '', //其他详情图

            //会员卡标签页表单--------------------------------------------
            vipCardForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
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
                ]
            },
            vipCardBannerImageUrl: '', //会员卡banner图
            vipCardThumImageUrl: '', //会员卡缩略图
            vipCardDetailImageUrl: '', //会员卡详情图

            //商品分类下拉框
            options: [
                {
                    label: '套餐',
                    value: '套餐'
                },
                {
                    label: '香槟',
                    value: '香槟'
                },
                {
                    label: '啤酒',
                    value: '啤酒'
                },
                {
                    label: '小吃',
                    value: '小吃'
                }
            ]
        };
    },

    methods: {
        handleSearch() {},

        //添加商品
        handleAdd() {
            this.dialogVisible = true;
        },

        //添加商品对话框里的取消按钮
        handleCancel() {
            this.dialogVisible = false;
        },

        //添加商品对话框里的确定按钮
        handleSure() {
            this.dialogVisible = false;
        },

        //标签页切换事件
        handleClick(tab, event) {
            console.log(this.activeName);
        },

        //批量删除
        handleDelAll() {},

        //商品编辑
        handleEdit() {},

        //商品删除
        handleDelete() {}
    }
};
</script>

<style>
.clearfix::after {
    content: '';
    display: block;
    clear: both;
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
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.goods-box .goods-detail {
    width: 90%;
}

.goods-box .goods-detail .goods-price {
    font-size: 14px;
}

.goods-box > img {
    width: 90%;
    height: 180px;
}

.goods-box .goods-detail .goods-handle {
    display: flex;
    justify-content: space-between;
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
    cursor: pointer;
    margin-right: 10px;
    border: 1px solid #ddd;
}

.combo-spec {
    width: 90%;
    /* border: 1px solid black; */
}

.el-textarea__inner {
    line-height: 3;
}

.drinks-update {
    display: flex;
    justify-content: space-between;
}

/* .drinks-check {
    display: flex;
    flex-direction: column;
    
} */

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

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
}

.avatar {
    width: 140px;
    height: 140px;
    display: block;
}

.el-upload--text {
    width: 140px !important;
    height: 140px !important;
}
</style>