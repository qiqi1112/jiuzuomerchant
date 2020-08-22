<template>
    <div class="con-wrap">
        <div class="container">
            <div class="left-wrap">
                <h4>店铺信息</h4>
                <div class="shop-info">
                    <div class="left-info">
                        <p>我的招牌logo</p>
                        <img src="img/img.jpg" alt />
                    </div>
                    <div class="right-info">
                        <p class="shop-name">
                            店名：
                            <span>PlayHouse</span>
                        </p>
                        <p class="shop-brief">
                            店铺简介：
                            <span>每一份属于夜晚的美丽心情，都不应该被雨水淋湿而打断——成都play house</span>
                        </p>
                    </div>
                </div>
                <div class="shop-label">
                    <p>店铺标签</p>
                    <el-tag
                        :key="tag"
                        closable
                        v-for="tag in dynamicTags"
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                    >{{tag}}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    ></el-input>
                    <el-button v-else class="button-new-tag" @click="showInput">
                        <i class="el-icon-plus"></i>
                    </el-button>
                </div>
                <div class="bussiness-hours">
                    <p>营业时间</p>
                    <span>20:00</span> ~
                    <span>03:00</span>
                </div>
                <div class="shop-address">
                    <p>店铺地址</p>
                    <el-form-item label="地址选择" prop="selectedOptions">
                        <el-cascader
                            :options="options"
                            v-model="selectedOptions"
                            @change="handleChangeData"
                            :separator="' '"
                        ></el-cascader>
                        <el-input v-model="formCustom.Detail"></el-input>
                    </el-form-item>
                </div>
                <div class="service-phone">
                    <p>客服电话</p>
                    <span>028-0000 0000</span>
                </div>
            </div>
            <div class="right-wrap"></div>
        </div>
    </div>
</template>

<script>
import options from '../../utils/country-level3-data';

export default {
    data() {
        return {
            dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: '',

            selectedOptions: [], //存放默认值
            options: options, //存放城市数据也就是显示出来
            formCustom: {
                Detail: '', //详细地址信息
                DetailMap: '', //城市地址详细地址拼接
                address: '' //省份城市
            }
        };
    },
    methods: {
        //删除当前标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        //点击添加标签按钮
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        //添加店铺标签
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
                console.log(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        // 触发三级联动 我们这是需要传字符串所以需要把数组转为字符串并用"/"间隔
        handleChangeData(value) {
            this.formCustom.address = value.join('/'); //获取到城市地址
        },

        //编辑接口
        // editList() {
        //     // 字符串拼接地址 详细地址 "\xa0"空格间隔
        //     this.formCustom.DetailMap += this.formCustom.address + '\xa0' + this.formCustom.Detail;
        //     //传参 传过去就行了
        //     address: this.formCustom.DetailMap;
        // },

        // 显示对应数据
        // showList() {
        //     const req = { 传对应参数 };
        //     gymnasiumLookVue(req).then((res) => {
        //         if (res.data.code == '200') {
        //             this.introductionListLook = res.data.data.rows;
        //             this.introductionListLook.map((item) => {
        //                 // 地址回显
        //                 // 切开省份地址和地址描述
        //                 //通过刚才添加的空格把两者区分开 下标为0就是三级联动 ，为1就是三级联动后面的具体地址描述
        //                 let addressData = item.address.split('\xa0');
        //                 //三级联动的value要与label相同，所以不能有"/"切割开就好了
        //                 let selectData = addressData[0].split('/');
        //                 // 地址省份( 三级联动 )
        //                 this.selectedOptions = selectData;
        //                 // 省份城市后面的具体描述
        //                 this.formCustom.Detail = addressData[1]; // 如果有默认值不操作时把默认值传过去

        //                 if (this.selectedOptions) {
        //                     this.formCustom.address = this.selectedOptions.join('/');
        //                 }
        //             });
        //         } else {
        //             return false;
        //         }
        //     });
        // }
    }
};
</script>

<style scoped>
.con-wrap {
    height: 100%;
}

.container {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
}

.left-wrap {
    /* border: 1px solid black; */
    width: 50%;
    height: 100%;
}

.left-wrap h4 {
    font-weight: normal;
    display: flex;
    align-items: center;
    height: 26px;
    margin-bottom: 30px;
    box-sizing: border-box;
}

.left-wrap h4::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 26px;
    margin-right: 10px;
    background-color: #000;
}

.left-wrap .shop-info {
    height: 160px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    border: 1px solid black;
}

.left-wrap .shop-info .left-info {
    margin-right: 60px;
}

.left-wrap .shop-info .left-info > p {
    margin-bottom: 10px;
}

.left-wrap .shop-info .left-info > img {
    border-radius: 8px;
}

.left-wrap .shop-info .right-info .shop-name {
    margin-bottom: 40px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;
    font-weight: bolder;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.el-tag--small {
    height: 32px;
    line-height: 32px;
}

.left-wrap .shop-label {
    margin-bottom: 30px;
    border: 1px solid black;
}

.left-wrap .shop-label > p {
    margin-bottom: 10px;
}

.left-wrap .bussiness-hours {
    margin-bottom: 30px;
    border: 1px solid black;
}

.left-wrap .bussiness-hours > p {
    margin-bottom: 10px;
}

.left-wrap .shop-address {
    margin-bottom: 30px;
    border: 1px solid black;
}

.left-wrap .shop-address > p {
    margin-bottom: 10px;
}

.left-wrap .service-phone {
    border: 1px solid black;
    margin-bottom: 30px;
}

.left-wrap .service-phone > p {
    margin-bottom: 10px;
}

.right-wrap {
    /* border: 1px solid black; */
    width: 50%;
    height: 100%;
}
</style>