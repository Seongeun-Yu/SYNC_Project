sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("cl3.syncyoung.sd.b2c.b2corder.controller.DetailView", {
        onInit: function(){
            // 판매오더 아이템 데이터 가져오기
            var oItemModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0009_CDS/");
      
            oItemModel.read("/B2CItemSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);
                }, 
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 

            // 읽어 온 데이터로 모델 세팅
            this.getView().setModel(oItemModel, "orderitem");


            // 라우팅 매개변수 읽어와서 데이터 필터링
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

        },

        _onObjectMatched: function(oEvent){
            // 판매주문 번호 읽어오기
            var vSonum = oEvent.getParameter("arguments").id;

            // 필터
            var aFilters = [];

            // 필터링 조건 세팅
            if (vSonum){
                aFilters.push(new Filter("sonum", FilterOperator.Contains, vSonum));
            }

            // 데이터 바인딩에 필터 적용
            var oBinding = this.byId("DetailList").getBinding("rows");

            oBinding.filter(aFilters);
        }
    }); 
});