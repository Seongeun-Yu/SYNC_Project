sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/format/DateFormat"
],
function (Controller, Filter, FilterOperator, NumberFormat, DateFormat) {
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

            // 라우팅 매개변수로 주문 상세 정보 세팅
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

        },

        _onObjectMatched: function(oEvent){
            // 판매주문 번호 읽어오기
            var vSonum = oEvent.getParameter("arguments").id;

            // 판매주문 번호 세팅
            this.byId("sonumParameter").setText(vSonum);

            // 주문 & 주문자 정보 컴포넌트
            var oPdate = this.byId("pdate");
            var oNetwr = this.byId("netwr");
            var oCusnum = this.byId("cusnum");
            var oName = this.byId("name");
            var oaddress = this.byId("address");
            var oTel = this.byId("tel");

            // 주문 정보(판매오더 Header & 회원 정보) 읽어오기
            var oSalesModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0004_CDS/");

            var vOrderPath = "/B2CSalesSet('" + vSonum + "')";
            oSalesModel.read(vOrderPath, {
                success: function(oData){
                    console.log("데이터 읽기 성공:", oData);

                    // 날짜 & 금액 데이터 포멧팅
                    var oDateFormat = DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd"
                    });
                    var sFormattedDate = oDateFormat.format(oData.pdate);

                    var oCurrencyFormat = NumberFormat.getFloatInstance({
                        groupingEnabled: true,
                        groupingSeparator: ","
                    });
                    var sFormattedNetwr = oCurrencyFormat.format(oData.netwr);
                    
                    // 주문 & 주문자 정보 세팅
                    oPdate.setText(sFormattedDate);
                    oNetwr.setText(sFormattedNetwr + "원");
                    oName.setText(oData.cust_name);
                    oaddress.setText(oData.adrnr + " " + oData.adr_detail);
                    oTel.setText(oData.telnr);
                },
                error: function(oError){
                    console.error("오류 발생:", oError);
                }
            });

            // 판매오더 아이템 필터링
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