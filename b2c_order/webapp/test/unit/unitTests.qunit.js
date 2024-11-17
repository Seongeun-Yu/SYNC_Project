/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cl3syncyoungsdb2c/b2c_order/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
