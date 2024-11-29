sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel"
],
function (Controller, Sorter, ChartFormatter, DateFormat, JSONModel) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.saleschart.saleschart.controller.SalesView", {
        onInit: function () {
            // 자재별 매출 oData 불러오기
            var oMaterialModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0002_CDS/");
            oMaterialModel.read("/SalesPerMaterialSet(p_start_date='19000101',p_end_date='99990131')/Set", { // Default : 전체 기간
                success: function(oData) {
                    console.log("Material 데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("Material 오류 발생:", oError);
                }
            }); 

            // BP별 매출 oData 불러오기
            var oBPModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0003_CDS/"); 
            oBPModel.read("/SalesPerBPSet(p_start_date='19000101',p_end_date='99990131')/Set", { // Default : 전체 기간
                success: function(oData) {
                    console.log("BP 데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("BP 오류 발생:", oError);
                }
            });

            // 불러 온 oData 모델에 바인딩
            this.getView().setModel(oMaterialModel, "material");
            this.getView().setModel(oBPModel, "bp");


            // 매출 기준 내림차순으로 정렬
            this.byId("BPChart").getBinding("data").sort(new Sorter("netwr", "true"));          // BP별 매출 차트 : 매출 내림차순 정렬
            this.byId("MaterialChart").getBinding("data").sort(new Sorter("netwr", "true"));    // 자재별 매출 차트 : 매출 내림차순 정렬

            // 매출 차트 PopOver 세팅
            var oChannelChart = this.getView().byId("Channel");
            var oChannelPopOver = this.getView().byId("ChannelPopOver");
            oChannelPopOver.connect(oChannelChart.getVizUid());
            oChannelPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDCURRENCY.STANDARDFLOAT);

            var oBPChart = this.getView().byId("BP");
            var oBPPopOver = this.getView().byId("BPPopOver");
            oBPPopOver.connect(oBPChart.getVizUid());
            oBPPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDCURRENCY.STANDARDFLOAT);

            var oMaterialChart = this.getView().byId("Material");
            var oMaterialPopOver = this.getView().byId("MaterialPopOver");
            oMaterialPopOver.connect(oMaterialChart.getVizUid());
            oMaterialPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDCURRENCY.STANDARDFLOAT); 
            
        },

        onPress : function(){
            // 날짜 formatter
            var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyyMMdd" });

            // 사용자가 입력한 조회 기간 읽어오기
            var startDate = oDateFormat.format(this.byId("dateInput").getDateValue());
            var endDate = oDateFormat.format(this.byId("dateInput").getSecondDateValue());

            // 경로 세팅
            var sChannelPath, sMaterialPath, sBPPath;

            // Input Validation
            if (startDate != "" || endDate != ""){
                // Valid Input
                sChannelPath = "/SalesPerChannelSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";
                sMaterialPath = "material>/SalesPerMaterialSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";
                sBPPath = "bp>/SalesPerBPSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";
            }
            else{
                // Invalid Input
                sChannelPath = "/SalesPerChannelSet(p_start_date='19000101',p_end_date='99991231')/Set";
                sMaterialPath = "material>/SalesPerMaterialSet(p_start_date='19000101',p_end_date='99991231')/Set";
                sBPPath = "bp>/SalesPerBPSet(p_start_date='19000101',p_end_date='99991231')/Set";
            }

            // Get Chart Element
            var oChannelChart = this.byId("ChannelChart");
            var oMaterialChart = this.byId("MaterialChart");
            var oBPChart = this.byId("BPChart");

            // Change data binding
            oChannelChart.bindAggregation("data", { path: sChannelPath });
            oMaterialChart.bindAggregation("data", { path: sMaterialPath });
            oBPChart.bindAggregation("data", { path: sBPPath });

            // Sorting
            this.byId("BPChart").getBinding("data").sort(new Sorter("netwr", "true"));          // BP별 매출 차트 : 매출 내림차순 정렬
            this.byId("MaterialChart").getBinding("data").sort(new Sorter("netwr", "true"));    // 자재별 매출 차트 : 매출 내림차순 정렬
        },

        onClear: function(){
            this.byId("dateInput").setValue("");
        },

        onDatePress : function(option){
            var oDatePicker = this.byId("dateInput");
            var oToday = new Date();
            var oStartDate, oEndDate;

            switch(option){
                case 'today' : 
                    oStartDate = oEndDate = oToday;
                    break;
                case 'week' : 
                    // First day of this week(Monday)
                    oStartDate = new Date(oToday);
                    oStartDate.setDate(oToday.getDate() - oToday.getDay() + 1);
                    // Last day of this week(Sunday)
                    oEndDate = new Date(oToday);
                    oEndDate.setDate(oStartDate.getDate() + 6);
                    break;
                case 'month' : 
                    // First day of this month
                    oStartDate = new Date(oToday.getFullYear(), oToday.getMonth(), 1);
                    // Last day of this month
                    oEndDate = new Date(oToday.getFullYear(), oToday.getMonth() + 1, 0);
                    break;
                case 'year' : 
                    oStartDate = new Date(oToday.getFullYear(), 0, 1);
                    oEndDate = new Date(oToday.getFullYear(), 11, 31);
                    break;
            }

            oDatePicker.setDateValue(oStartDate);
            oDatePicker.setSecondDateValue(oEndDate);
        }
    });
});
