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
        
        onSearch : function(oEvent) {
            var sonumInput = this.byId("sonumInput").getValue();
            var nameInput = this.byId("nameInput").getValue();
            var dateInput = this.byId("dateInput").getValue();
            var startDate = dateInput.substring(0, 8);
            var endDate = dateInput.substring(10, 19)

            // var startDate2 = this.byId("dateInput").getDateValue();
            // var endDate2 = this.byId("dateInput").getSecondDateValue();

            console.log(startDate2);
            console.log(endDate2);

            var aFilters = [];

            if (sonumInput){
                aFilters.push(new Filter("sonum", FilterOperator.Contains, sonumInput));
            }
            if (nameInput){
                aFilters.push(new Filter("cust_name", FilterOperator.Contains, nameInput));
            }
            if (startDate && endDate){
                aFilters.push( new Filter({
                    filters : [
                        // new Filter("pdate", FilterOperator.GE, startDate.toISOString().split("T")[0]),
                        // new Filter("pdate", FilterOperator.GE, endDate.toISOString().split("T")[0])
                        new Filter("pdate", FilterOperator.GE, startDate),
                        new Filter("pdate", FilterOperator.GE, endDate)
                    ],
                    and : true
                }));
            }

            console.log(aFilters);

            var oTable = this.byId("OrderTable");
            var oBinding = oTable.getBinding("rows");

            oBinding.filter(aFilters);
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
