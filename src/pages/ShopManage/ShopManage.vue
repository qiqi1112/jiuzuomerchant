<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-card>
                <span>商店简介</span>
            </el-card>

            <div class="goodsList">
                <el-card class="box-card">
                    <div class="top-box"></div>
                    <div class="botm-box"></div>
                </el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
                <el-card class="box-card"></el-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style scoped>
.box-card {
    width: 20%;
    /* margin-right: 20px; */
}

.goodsList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
</style>