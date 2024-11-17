sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("cl3.syncyoung.sd.b2c.b2corder.controller.OrderView", {
        onInit: function () {
            var oItemModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302SDCDS0009_CDS/");
      
            oItemModel.read("/B2CItemSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);
                }, 
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            this.getView().setModel(oItemModel, "orderitem");

        },
        
        onSearch : function(){

        },

        onOpenDialog : function(oEvent){
            var oButton = oEvent.getSource();

            var oContext = oButton.getParent().getBindingContext();
            var vSonum = oContext.getProperty('sonum');

            console.log(vSonum);

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
