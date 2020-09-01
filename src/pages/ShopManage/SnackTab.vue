<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="snackForm" :model="snackForm" label-width="80px">
                <p>
                    <span>小吃名称：</span>
                    <el-input v-model="snackForm.name" style="width:200px"></el-input>
                </p>
                <p>
                    <span>小吃包含：</span>
                    <el-input type="textarea" v-model="snackForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>小吃原单价：</span>
                    <el-input v-model="snackForm.originPrice" style="width:120px;margin-right:20px"></el-input>

                    <span>小吃现单价：</span>
                    <el-input v-model="snackForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="combo-spec">
                    <span>小吃规格：</span>
                    <i v-for="(item,index) in snackForm.spec" :key="index">{{item}}</i>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    v-model="snackForm.checkedBanner"
                    label="放至商店Banner位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
                <!-- <el-select
                                            v-model="drinksForm.weight"
                                            placeholder="Banner位权重"
                                            style="width:140px"
                                        >
                                            <el-option
                                                v-for="item in snackForm.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                </el-select>-->
            </p>
            <!-- banner图 -->
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
            >
                <img v-if="snackForm.bannerImageUrl" :src="snackForm.bannerImageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>（*如需商店轮播推荐，请添加Banner图片）</span>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>小吃缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                >
                    <img v-if="snackForm.thumImageUrl" :src="snackForm.thumImageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <!-- 详情图 -->
            <p>
                <span>小吃详情图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                >
                    <img
                        v-if="snackForm.detailImageUrl"
                        :src="snackForm.detailImageUrl"
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
    data() {
        return {
            //小吃标签页表单------------------------------------------
            snackForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['小份', '中份', '大份'],
                checkedBanner: false,

                bannerImageUrl: '', //banner图
                bannerDialog: false, //查看图集时的对话框
                //banner图上传时携带的参数
                bannerImg: {
                    img: ''
                },

                thumImageUrl: '', //缩略图
                //缩略图上传时携带的参数
                thumImg: {
                    img: ''
                },

                detailImageUrl: '', //详情图
                //详情图上传时携带的参数
                detailImg: {
                    img: ''
                }
            }
        };
    }
};
</script>

<style scoped>
</style>