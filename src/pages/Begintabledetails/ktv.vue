<template>
    <div class="error-page">
        <template>
            <el-table v-loading="loading" style="width: 100%"> </el-table>
        </template>
    </div>
</template>

  </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true
        };
    },
    methods: {
        open() {
            this.$alert('KTV不具备此功能', '标题名称', {
                confirmButtonText: '确定',
                callback: (action) => {
                    this.$router.go(-1);
                }
            });
        }
    },
    created() {
        setTimeout(() => {
            this.loading = false; 
            this.open();
        }, 1000);
    }
};
</script>


<style scoped>
.error-page {
    width: 100%;
    height: 100%;
}
.el-table {
    width: 100%;
    height: 100%;
}
</style>
