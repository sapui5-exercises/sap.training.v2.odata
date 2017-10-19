sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox"
], function(Controller, ODataModel, MessageBox) {
	"use strict";

	return Controller.extend("sap.training.v2.odata.controller.Main", {

		onInit: function() {
			var sUrl = "/sap/opu/odata/sap/ZTRAVEL_SRV/";
			var oModel = new ODataModel(sUrl, {
				useBatch: false
			});

			this.getView().setModel(oModel);
		},

		onFlightChange: function(oEvent) {
			// get the binding context of the selected row
			var selectedRowContext = oEvent.getParameter("rowContext");
			var sPath = selectedRowContext.getPath();

			var oBookingTable = this.getView().byId("idBookingTable");
			oBookingTable.bindElement(sPath);
		},

		onCancelBooking: function(oEvent) {
			var carrId = oEvent.getSource().data("Carrid");
			var bookId = oEvent.getSource().data("Bookid");

			var oModel = this.getView().getModel();

			oModel.callFunction("/CancelBooking", {
				method: "POST",
				urlParameters: {
					Carrid: carrId,
					Bookid: bookId
				},
				error: function(oError) {
					var oMsg = JSON.parse(oError.responseText);
					sap.m.MessageBox.error(oMsg.error.innererror.errordetails[0].message, {
						details: oMsg
					});
				}
			});
		},

		onCreateBooking: function(oEvent) {

			var carrId = oEvent.getSource().data("Carrid");
			var connId = oEvent.getSource().data("Connid");
			var fldate = oEvent.getSource().data("Fldate");

			var oBookingData = {
				"Carrid": carrId,
				"Connid": connId,
				"Fldate": fldate,
				"Customid": "154",
				"Passname": "Anita Acht",
				"Counter": "1"
			};

			var oBookingTable = this.getView().byId("idBookingTable");
			var oModel = this.getView().getModel();

			oModel.create("/ZBC_C_Booking_TP", oBookingData, {
				success: function(OData) {
					MessageBox.success("Buchung angelegt mit Buchungsnummer " + OData.Bookid);

					var oSorter = new sap.ui.model.Sorter("OrderDate", true);
					oBookingTable.getBinding("rows").sort([oSorter]);
				},
				error: function(oError) {
					var oMsg = JSON.parse(oError.responseText);
					sap.m.MessageBox.error(oMsg.error.innererror.errordetails[0].message, {
						details: oMsg
					});
				}
			});
		}

	});
});