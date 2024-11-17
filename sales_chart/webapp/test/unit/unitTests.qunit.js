/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl3syncyoungsdsaleschart/sales_chart/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
