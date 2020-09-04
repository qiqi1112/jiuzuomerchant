<template>
    <div class="goods-info-box">
        <div class="left-box drinks">
            <el-form ref="drinksForm" :model="drinksForm" label-width="80px">
                <p>
                    <span>酒水名称：</span>
                    <el-input v-model="drinksForm.name" style="width:170px;margin-right:20px"></el-input>
                    <!-- 酒水分类 -->
                    <el-select
                        v-model="drinksForm.classify"
                        placeholder="酒水分类"
                        style="width:150px;margin-right:20px"
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
                    <span>商品排序：</span>
                    <el-input-number v-model="drinksForm.goodWeight" :min="0" label="商品排序"></el-input-number>
                </p>
                <p>
                    <span>酒水包含：</span>
                    <el-input type="textarea" v-model="drinksForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>酒水原单价：</span>
                    <el-input
                        v-model="drinksForm.originPrice"
                        style="width:120px;margin-right:20px"
                    ></el-input>

                    <span>酒水现单价：</span>
                    <el-input v-model="drinksForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="drinks-spec">
                    <span>酒水规格：</span>
                    <el-form
                        :model="drinksForm.dynamicValidateForm"
                        ref="drinksForm.dynamicValidateForm"
                        label-width="100px"
                        class="demo-dynamic"
                    >
                        <el-form-item
                            v-for="(domain, index) in drinksForm.dynamicValidateForm.domains"
                            :key="index"
                        >
                            <el-input
                                v-model="domain.specName"
                                placeholder="规格（如：一箱）"
                                style="width:132px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="domain.originalPrice"
                                placeholder="原价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="domain.presentPrice"
                                placeholder="现价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-button @click="addDomain">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button
                                v-show="drinksForm.dynamicValidateForm.domains.length > 1"
                                @click.prevent="removeDomain(domain)"
                            >
                                <i class="el-icon-close"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </p>
            </el-form>
            <div class="drinks-update-box">
                <!-- 推荐banner图 -->
                <div class="banner-box">
                    <el-checkbox
                        v-model="drinksForm.checkedBanner"
                        label="放至商店Banner位"
                        border
                        style="margin-right:20px"
                    ></el-checkbox>
                    <div class="drinks-div">
                        <el-upload
                            v-if="drinksForm.checkedBanner&&drinksForm.checkedBanner !== 2"
                            class="avatar-uploader"
                            action="1"
                            list-type="picture-card"
                            :http-request="uploadBannerFiles"
                            :on-remove="bannerRemove"
                            :file-list="drinksForm.bannerImgBox"
                            :on-error="uploadError"
                        >
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*如需商店轮播推荐，请添加Banner图片）</span>
                    </div>
                </div>

                <!-- 商家推荐位 -->
                <div class="reco-box">
                    <el-checkbox
                        v-model="drinksForm.checkedReco"
                        label="放至商家推荐位"
                        border
                        style="width:88%;margin-bottom: 20px;"
                    ></el-checkbox>
                    <!-- <span>推荐位排序（可选）：</span>
                    <el-input-number v-model="drinksForm.recoWeight" :min="0" label="推荐位排序"></el-input-number>-->
                    <div v-if="drinksForm.checkedReco&&drinksForm.checkedReco !==2">
                        <span>推荐位排序：</span>
                        <el-input-number v-model="drinksForm.recoWeight" :min="0" label="推荐位排序"></el-input-number>
                    </div>

                    <div class="drinks-div">
                        <el-upload
                            v-if="drinksForm.checkedReco&&drinksForm.checkedReco !== 2"
                            class="avatar-uploader"
                            action="1"
                            :show-file-list="false"
                            :http-request="uploadRecoFiles"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="drinksForm.recoImageUrl"
                                :src="showImgPrefix + drinksForm.recoImageUrl"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*如需商家推荐，请添加推荐位图片）</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>酒水缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadThumFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="drinksForm.thumImageUrl"
                        :src="showImgPrefix + drinksForm.thumImageUrl"
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
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadDetailFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="drinksForm.detailImageUrl"
                        :src="showImgPrefix + drinksForm.detailImageUrl"
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
    props: ['drinksFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //酒水标签页表单-----------------------------------------
            drinksForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                checkedReco: false,

                //酒水分类
                classify: 1,
                classifyOptions: [
                    {
                        label: '红酒',
                        value: 1
                    },
                    {
                        label: '白酒',
                        value: 2
                    },
                    {
                        label: '啤酒',
                        value: 3
                    },
                    {
                        label: '香槟',
                        value: 4
                    },
                    {
                        label: '洋酒',
                        value: 5
                    },
                    {
                        label: '调制酒',
                        value: 6
                    },
                    {
                        label: '饮料',
                        value: 7
                    }
                ],

                //商品排序
                goodWeight: 0,

                //商家推荐位排序
                recoWeight: 0,

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: [], //上传banner图集时的url数组
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //酒水新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '' //规格现价
                        }
                    ]
                }
            }
        };
    },

    watch: {
        drinksForm: {
            handler(val) {
                this.sendChildForm();
            },
            deep: true
        }
    },

    mounted() {
        this.assignParentToChild(); //回显商品信息
        console.log('酒水组件');
    },

    methods: {
        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('drinksFormChild', this.drinksForm);
        },

        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.drinksForm.name = this.drinksFormParent.name;
            this.drinksForm.goodWeight = this.drinksFormParent.goodWeight;
            this.drinksForm.desc = this.drinksFormParent.desc;
            this.drinksForm.originPrice = this.drinksFormParent.originPrice;
            this.drinksForm.nowPrice = this.drinksFormParent.nowPrice;
            this.drinksForm.checkedBanner = this.drinksFormParent.checkedBanner;
            this.drinksForm.checkedReco = this.drinksFormParent.checkedReco;
            this.drinksForm.classify = this.drinksFormParent.classify;
            this.drinksForm.recoWeight = this.drinksFormParent.recoWeight;
            this.drinksForm.bannerUploadUrl = this.drinksFormParent.bannerUploadUrl;
            this.drinksForm.recoImageUrl = this.drinksFormParent.recoImageUrl;
            this.drinksForm.thumImageUrl = this.drinksFormParent.thumImageUrl;
            this.drinksForm.detailImageUrl = this.drinksFormParent.detailImageUrl;
            this.drinksForm.dynamicValidateForm.domains = this.drinksFormParent.dynamicValidateForm.domains;

            //如果回显的图集长度大于1，才回显图片（空字符也算一个值）
            if (this.drinksForm.bannerUploadUrl.length > 0) {
                this.showBannerImg(); //回显banner图片
            }
        },

        //回显banner图集
        showBannerImg() {
            let pictureArr = this.drinksForm.bannerUploadUrl;
            this.drinksForm.bannerImgBox = [];
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = this.showImgPrefix + item;
                this.drinksForm.bannerImgBox.push(obj);
            });
        },

        // 删除banner图集
        bannerRemove(file) {
            this.drinksForm.bannerUploadUrl.forEach((item, i) => {
                if (file.url == this.showImgPrefix + item) {
                    this.drinksForm.bannerUploadUrl.splice(i, 1);
                }
            });

            console.log("删除banner后的地址",this.drinksForm.bannerUploadUrl);
        },

        //酒水规格添加按钮
        addDomain() {
            this.drinksForm.dynamicValidateForm.domains.push({
                specName: '', //规格
                originalPrice: '', //规格原价
                presentPrice: '' //规格现价
            });
        },

        //酒水规格删除按钮
        removeDomain(item) {
            var index = this.drinksForm.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.drinksForm.dynamicValidateForm.domains.splice(index, 1);
            }
        },

        //上传banner图集
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.drinksForm.bannerUploadUrl.push(res.data[0]);
                console.log('图集地址', this.drinksForm.bannerUploadUrl);
            });
        },

        //上传推荐位图
        uploadRecoFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.recoImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.detailImageUrl = res.data;
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
</style>