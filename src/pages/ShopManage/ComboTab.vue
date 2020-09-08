<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="comboForm" :model="comboForm" label-width="80px">
                <div class="good-name-box">
                    <div>
                        <span>套餐名称：</span>
                        <el-input v-model="comboForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序：</span>
                        <el-input-number v-model="comboForm.weight" :min="0" label="商品排序"></el-input-number>
                        <span>（*数值越小排序越靠前）</span>
                    </div>
                </div>
                <p>
                    <span>套餐包含：</span>
                    <el-input type="textarea" v-model="comboForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>选择商品：</span>
                    <el-select
                        v-model="comboForm.goodName"
                        filterable
                        remote
                        placeholder="请选择"
                        @change="selectGoodInfo"
                        @focus="selectGoodsList"
                    >
                        <el-option
                            v-for="(item,index) in comboForm.options"
                            :key="index"
                            :label="item.name"
                            :value="item.id + '+' + item.listPicture + '+' + item.name + '+' + item.originalPrice + '+' + item.presentPrice"
                        ></el-option>
                    </el-select>
                </p>
                <p style="width:82%" v-if="comboForm.tableData.length > 0">
                    <el-table :data="comboForm.tableData" border>
                        <el-table-column prop="goodsName" label="商品名称" width="150"></el-table-column>
                        <el-table-column label="商品图片" width="126">
                            <template slot-scope="scope">
                                <img
                                    style="width:100px;height:60px"
                                    :src="showImgPrefix + scope.row.listPicture"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column prop="originalPrice" label="原价" width="100"></el-table-column>
                        <el-table-column prop="presentPrice" label="现价" width="100"></el-table-column>
                        <el-table-column prop="presentPrice" label="数量" width="160">
                            <template slot-scope="scope">
                                <el-input-number v-model="scope.row.number" :min="1" label="商品数量"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)"
                                >移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </p>
                <p>
                    <span>套餐原单价：</span>
                    <el-input v-model="comboForm.originPrice" style="width:120px;margin-right:20px"></el-input>

                    <span>套餐现单价：</span>
                    <el-input v-model="comboForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="combo-spec">
                    <span>套餐规格：</span>
                    <i v-for="(item,index) in comboForm.spec" :key="index">{{item}}</i>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    v-model="comboForm.checkedBanner"
                    label="放至商店广告位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- 广告图 -->
            <el-upload
                v-if="comboForm.checkedBanner&&comboForm.checkedBanner !== 2"
                class="avatar-uploader"
                action="1"
                :show-file-list="false"
                :http-request="uploadBannerFiles"
                :on-error="uploadError"
            >
                <img
                    v-if="comboForm.bannerImageUrl"
                    :src="showImgPrefix + comboForm.bannerImageUrl"
                    class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>（*如需商店轮播推荐，请添加广告图片）</span>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>套餐缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadThumFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="comboForm.thumImageUrl"
                        :src="showImgPrefix + comboForm.thumImageUrl"
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
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadDetailFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="comboForm.detailImageUrl"
                        :src="showImgPrefix + comboForm.detailImageUrl"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['comboFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //表单属性
            comboForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false,
                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图
                options: [], //输入框请求到的商品信息数组
                goodName: '', //选中的商品对应的信息
                tableData: [], //渲染表格时的所有商品数据
                goodsIdList: [] //所有已选择的商品对应的id
            },

            antiStatus: true //防抖状态值
        };
    },

    watch: {
        //监听表单信息变化
        comboForm: {
            handler() {
                this.sendChildForm();
            },
            deep: true
        }
    },

    mounted() {
        this.assignParentToChild(); //回显商品信息
        console.log('套餐组件');
    },

    methods: {
        //处理当前选中的商品信息
        selectGoodInfo() {
            let goodInfoArr = this.comboForm.goodName.split('+'); //将字符串拆分成数组

            //将商品相关信息存入对象
            let obj = {
                goodsId: goodInfoArr[0],
                listPicture: goodInfoArr[1],
                goodsName: goodInfoArr[2],
                originalPrice: goodInfoArr[3],
                presentPrice: goodInfoArr[4],
                number: 1
            };

            this.comboForm.goodsIdList.push(goodInfoArr[0]); //存入当前选择的商品id

            this.comboForm.tableData.push(obj); //存入当前选择的商品所有信息，用于表格回显

            this.comboForm.goodName = ''; //清空选择的选项

            this.selectGoodsList(); //重新请求商品列表

            console.log(this.comboForm.tableData);
        },

        //请求商品列表
        selectGoodsList() {
            if (this.antiStatus == true) {
                this.antiStatus = false;
                let data = {
                    goodsIdList: this.comboForm.goodsIdList,
                    name: this.comboForm.goodName
                };
                this.$post('/api/merchant/store/goods/setMealSelectGoodsList', data).then((res) => {
                    if (res.code == 0) {
                        this.comboForm.options = res.data;
                        this.antiStatus = true;
                        console.log(this.comboForm.options);
                    } else {
                        this.antiStatus = true;
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //移除商品列表里的商品
        handleDelete(index, row) {
            //在表格中移除当前商品
            this.comboForm.tableData.forEach((item, i) => {
                if (row.goodsId == item.goodsId) {
                    this.comboForm.tableData.splice(i, 1);

                    //在所已选择的商品id中移除当前商品的id
                    this.comboForm.goodsIdList.forEach((item, i) => {
                        if (row.goodsId == item) {
                            this.comboForm.goodsIdList.splice(i, 1);
                        }
                    });
                }
            });
        },

        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.comboForm.name = this.comboFormParent.name;
            this.comboForm.weight = this.comboFormParent.weight;
            this.comboForm.desc = this.comboFormParent.desc;
            this.comboForm.originPrice = this.comboFormParent.originPrice;
            this.comboForm.nowPrice = this.comboFormParent.nowPrice;
            this.comboForm.checkedBanner = this.comboFormParent.checkedBanner;
            this.comboForm.bannerImageUrl = this.comboFormParent.bannerImageUrl;
            this.comboForm.thumImageUrl = this.comboFormParent.thumImageUrl;
            this.comboForm.detailImageUrl = this.comboFormParent.detailImageUrl;
            this.comboForm.tableData = this.comboFormParent.tableData;
            this.comboForm.goodsIdList = this.comboFormParent.goodsIdList;
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('comboFormChild', this.comboForm);
        },

        //上传广告图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.comboForm.bannerImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.comboForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.comboForm.detailImageUrl = res.data;
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        }
    }
};
</script>

<style scoped>
/* >>>.el-table td,.el-table th {
    text-align: center !important;
} */
</style>