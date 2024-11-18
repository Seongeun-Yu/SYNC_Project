sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.b2c.b2corder.controller.OrderView", {
        onInit: function () {
            // 판매오더 아이템 데이터 불러오기
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

        },
        
        onSearch : function(oEvent) {
            // 검색 조건 읽어오기
            var sonumInput = this.byId("sonumInput").getValue();        // 판매주문번호
            var nameInput = this.byId("nameInput").getValue();          // 회원명

            var startDate = this.byId("dateInput").getDateValue();      // 주문일자(from)
            var endDate = this.byId("dateInput").getSecondDateValue();  // 주문일자(to)

            // 필터
            var aFilters = [];

            // 필터링 조건 세팅
            if (sonumInput){
                aFilters.push(new Filter("sonum", FilterOperator.Contains, sonumInput));
            }
            if (nameInput){
                aFilters.push(new Filter("cust_name", FilterOperator.Contains, nameInput));
            }
            if (startDate && endDate){
                aFilters.push( new Filter({
                    filters : [
                        new Filter("pdate", FilterOperator.GE, startDate.toISOString().split("T")[0]),
                        new Filter("pdate", FilterOperator.LE, endDate.toISOString().split("T")[0])
                    ],
                    and : true
                }));
            }

            // 데이터 바인딩에 필터 적용
            var oBinding = this.byId("OrderTable").getBinding("rows");

            oBinding.filter(aFilters);
		},

        onOpenDialog : function(oEvent){
            var oButton = oEvent.getSource();

            var oContext = oButton.getParent().getBindingContext();
            var vSonum = oContext.getProperty('sonum');

            var vSonum2 = this.byId("sonum").getText();

            console.log("vSonum : ", vSonum);
            console.log("new : ", vSonum2);

            if(!this.pDialog){
                this.pDialog = this.loadFragment({
                    name : 'cl3.syncyoung.sd.b2c.b2corder.view.Item'
                });
            }

            this.pDialog.then(function(oDialog){
                var oTable = oDialog.getContent()[0];

                if(oTable && oTable.isA("sap.ui.table.Table")){
                    var oBinding= oTable.getBinding("rows");

                    var aFilter = [new Filter("sonum", FilterOperator.EQ, vSonum)];

                    oBinding.filter(aFilter);

                }
                oDialog.open();
            });


        },

        onCloseDialog : function(){
            this.byId("itemDialog").close();
        }
    });
});
