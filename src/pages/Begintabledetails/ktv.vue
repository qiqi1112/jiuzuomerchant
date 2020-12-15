<template>
    <div class="error-page">
    </div>
</template>

  </div>
</template>

<script>
export default {
    data() {
        return {
           
        };
    },
    methods: {
        open() {
            this.$alert('KTV不具备此功能', '提示：', {
                confirmButtonText: '确定',
                callback: (action) => {
                    this.$router.go(-1);
                }
            });
        }
    },
    created() {
        this.open();
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
