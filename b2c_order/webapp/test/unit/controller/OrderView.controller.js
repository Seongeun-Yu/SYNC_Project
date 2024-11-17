/*global QUnit*/

sap.ui.define([
	"cl3syncyoungsdb2c/b2c_order/controller/OrderView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("OrderView Controller");

	QUnit.test("I should test the OrderView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
