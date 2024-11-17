/*global QUnit*/

sap.ui.define([
	"cl3syncyoungsdsaleschart/sales_chart/controller/SalesView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SalesView Controller");

	QUnit.test("I should test the SalesView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
