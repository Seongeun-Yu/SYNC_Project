sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.saleschart.saleschart.controller.SalesView", {
        onInit: function () {

            // (1) Get oData for sales per material
            var oMaterialModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0002_CDS/"); // ODataModel 초기화

            // 페이터 읽기 (GET 요청)
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

            // 페이터 읽기 (GET 요청)
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

            // console.log(this.getView().getModel().getProperty("/"));
            
        }
    });
});
