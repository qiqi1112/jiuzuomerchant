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
                <el-dialog :visible.sync="dialogVisible">
                    <span class="add-classify-title">选择添加种类</span>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="套餐" name="combo">
                            <span class="add-classify-title goods-info">商品信息</span>
                            <div class="goods-info-box">
                                <el-form ref="form" :model="form" label-width="80px">
                                    <p>
                                        <span>套餐名称：</span>
                                        <el-input v-model="form.name" style="width:200px"></el-input>
                                    </p>
                                    <p>
                                        <span>套餐包含：</span>
                                        <el-input type="textarea" v-model="form.desc" style="width:300px"></el-input>
                                    </p>

                                    <p>
                                        <span>套餐原价：</span>
                                        <el-input v-model="form.originPrice" style="width:200px"></el-input>
                                    </p>

                                    <p>
                                        <span>套餐现价：</span>
                                        <el-input v-model="form.nowPrice" style="width:200px"></el-input>
                                    </p>
                                    <p>
                                        <span>套餐规格：</span>
                                        <i>默认</i>
                                        <i>默认</i>
                                        <i>默认</i>
                                    </p>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="酒水" name="drinks">
                            <span class="add-classify-title goods-info">商品信息</span>
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

            form: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: ''
            },

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
    margin-bottom: 30px;
}

.goods-info-box {
    border: 1px solid black;
}

.goods-info-box p {
    margin-bottom: 30px;
}

.goods-info-box p>span {
    margin-right: 20px;
    /* float: left; */
    /* color: #f00; */
}

.goods-info-box p>i {
    display: inline-block;
    font-style: normal;
    text-align: center;
    line-height: 30px ;
    width: 60px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    border: 1px solid #ddd;
}
</style>