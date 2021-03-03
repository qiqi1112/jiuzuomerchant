<template>
    <!-- <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 财务管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h4>该板块供申请提供，有需要请致电：028-86944045</h4>
        </div>
    </div> -->
</template>





<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 订单管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- <el-button @click="myPrint">打印</el-button> -->
            <el-button @click="myPreview">打印预览</el-button>

            <!-- <div id="box">
                <p>哈哈哈</p>
                <p>嘻嘻嘻</p>
            </div> -->

            <!-- <div ref="print">
                <h1>大家好</h1>
                <h2>大家好</h2>
                <h6>大家好</h6>
                <p>我是渣渣辉</p>
            </div>
            <button @click="start_print">开始打印</button> -->
        </div>
    </div>
</template>

<script>
import { getLodop } from '../OrderManage/LodopFuncs.js';
// var LODOP = getLodop();

export default {
    data() {
        return {
            obj: {
                appDetails: '',
                cashPay: '0',
                changeSeatTime: null,
                closedReason: '已消费',
                closedStatus: 1,
                closedTime: '2021-01-21 17:10:04',
                commissionPay: 0,
                contactName: 'Promise',
                contactTel: '147****8227',
                couponAmount: '0.00',
                createTime: '2021-01-21 17:09:21',
                createTimeWeek: 4,
                finishTime: '2021-01-21 17:10:04',
                groupGoods: [],
                id: '1352181477852712961',
                minAmount: '0.10',
                occupySeatTime: 0,
                orderAmount: '94.05',
                orderNo: '1352181477840130049',
                orderType: 0,
                paidAmount: '94.05',
                payStatus: 1,
                payTime: '2021-01-21 17:09:21',
                payTimeWeek: 4,
                payWay: 2,
                payableAmount: '100.00',
                pointsPay: '94.05',
                retentionTime: '2021-01-21 07:00:00',
                seatCapacity: 1,
                seatCode: '1楼-1-1',
                smsCode: '1021',
                storeDetails: '',
                storeLocation: 1,
                takeTime: '2021-01-21 17:09:49'
            }
        };
    },

    methods: {
        // 打印
        start_print() {
            this.$print(this.$refs.print); //$refs的值要和html里的ref一致
        },

        //打印
        myPrint() {
            // let LODOP = getLodop();
            this.CreatePrintPage();
            LODOP.PRINT();
        },
        // 打印预览
        myPreview() {
            // LODOP = getLodop();
            this.CreatePrintPage();
            LODOP.PREVIEW();
        },

        CreatePrintPage() {
            // LODOP = getLodop();
            LODOP.PRINT_INIT('打印控件功能演示_Lodop功能_名片');
            // LODOP.ADD_PRINT_RECT(10, 55, 360, 220, 0, 1);
            LODOP.SET_PRINT_STYLE('FontSize', 11);
            // LODOP.ADD_PRINT_TEXT(20, 180, 100, 25, '徐大笑');
            LODOP.SET_PRINT_STYLEA(2, 'FontName', '隶书');
            LODOP.SET_PRINT_STYLEA(2, 'FontSize', 15);
            // LODOP.ADD_PRINT_TEXT(53, 187, 75, 20, '程序员');
            // LODOP.ADD_PRINT_TEXT(100, 131, 272, 20, '地址：中国北京社会科学院附近东大街西胡同';
            // LODOP.ADD_PRINT_TEXT(138, 132, 166, 20, '电话：010-88811888');

            let obj = this.obj,
                index = 10;
            for (let val in obj) {
                index += 30;
                LODOP.ADD_PRINT_TEXT(138 + index, 132, 166, 20, obj[val]);
            }
        },

        printPdf() {
            var strHTML = document.getElementById('box').innerHTML;
            let LODOP = getLodop();
            if (LODOP != null && typeof LODOP.VERSION != 'undefined') {
                LODOP.PRINT_INIT('');
                LODOP.SET_PRINT_PAGESIZE(3, '58mm', '10mm', 'CreateCustomPage');
                LODOP.SET_PRINT_STYLE('FontSize', 15); // 设置打印字体
                LODOP.SET_PRINT_STYLE('Bold', 1); // 设置加粗
                LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Height:90%');
                LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Full-Width');
                LODOP.ADD_PRINT_HTM(10, 10, '100%', '70%', strHTML);
                // LODOP.PRINT();
            }
        }
    }
};
</script>