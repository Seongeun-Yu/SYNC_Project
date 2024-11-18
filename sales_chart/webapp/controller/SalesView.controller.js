sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/ui/core/format/DateFormat"
],
function (Controller, Sorter, ChartFormatter, DateFormat) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.saleschart.saleschart.controller.SalesView", {
        onInit: function () {
            var sPath = "SalesPerChannelSet(p_start_date='19000101',p_end_date='99990131')/Set";
            this.getView().bindElement({
                path: sPath,
                model: ""
            });

            // (1) Get oData for sales per material
            var oMaterialModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0002_CDS/"); // ODataModel 초기화

            oMaterialModel.read("/SalesPerMaterialSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData.results);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 

            // (2) Get oData for sales per BP code
            var oBPModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0003_CDS/"); // ODataModel 초기화

            oBPModel.read("/SalesPerBPSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);
                    
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            });

            // (3) Set oDatas to each models
            this.getView().setModel(oMaterialModel, "material");
            this.getView().setModel(oBPModel, "bp")


            // (4) Sorting
            this.byId("BPChart").getBinding("data").sort(new Sorter("netwr", "true"));          // BP별 매출 차트 : 매출 내림차순 정렬
            this.byId("MaterialChart").getBinding("data").sort(new Sorter("netwr", "true"));    // 자재별 매출 차트 : 매출 내림차순 정렬

            // (5) PopOver
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
            // For Date Formatting
            var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyyMMdd" });

            // Get Date Input
            var startDate = oDateFormat.format(this.byId("dateInput").getDateValue());
            var endDate = oDateFormat.format(this.byId("dateInput").getSecondDateValue());

            // Make Path
            var sChannelPath = "/SalesPerChannelSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";
            var sMaterialPath = "material>/SalesPerMaterialSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";
            var sBPPath = "bp>/SalesPerBPSet(p_start_date='" + startDate + "',p_end_date='" + endDate + "')/Set";

            // Get Chart Element
            var oChannelChart = this.byId("ChannelChart");
            var oMaterialChart = this.byId("MaterialChart");
            var oBPChart = this.byId("BPChart");

            // Change data binding
            oChannelChart.bindAggregation("data", { path: sChannelPath });
            oMaterialChart.bindAggregation("data", { path: sMaterialPath });
            oBPChart.bindAggregation("data", { path: sBPPath });

        }
    });
});
