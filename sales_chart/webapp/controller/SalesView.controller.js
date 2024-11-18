sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter"
],
function (Controller, Sorter) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.saleschart.saleschart.controller.SalesView", {
        onInit: function () {

            // (1) Get oData for sales per material
            var oMaterialModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0002_CDS/"); // ODataModel 초기화

            oMaterialModel.read("/SalesPerMaterialSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);
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
        }
    });
});
