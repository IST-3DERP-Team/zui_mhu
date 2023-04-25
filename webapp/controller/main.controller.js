sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/ui/Device",
    "sap/ui/table/library",
    "sap/ui/core/Fragment",
    'jquery.sap.global'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter, Device, library, Fragment, jQuery) {
        "use strict";
        var that;
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yyyy" });
        var sapDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-ddTHH:mm:ss", UTC: false });
        return Controller.extend("zuimhu.controller.main", {
            onInit: function () {
                that = this;
                this.validationErrors = [];
                this.setButton('INIT');
                this._oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(new JSONModel({
                    SBU: '',
                    PLANTCD: '',
                    SLOC: '',
                    STORAREACD: '',
                    WHSECD: '',
                    HUID: ''
                }), "ui");

                this.setSmartFilterModel();
                var oModel = this.getOwnerComponent().getModel("ZVB_3DERP_MHU_FILTERS_CDS");
                oModel.read("/ZVB_3DERP_SBU_SH", {
                    success: function (oData, oResponse) {
                        //console.log(oData)
                        if (oData.results.length === 1) {
                            that.getView().getModel("ui").setProperty("/sbu", oData.results[0].SBU);
                        }
                        else {
                            //that.closeLoadingDialog();
                        }
                    },
                    error: function (err) { }
                });

                this._aColumns = {};
                this._aFilterableColumns = {};
                this._oDataBeforeChange = {};
                this._aDataBeforeChange = [];
                this._aInvalidValueState = [];
                this.byId("mainTab").removeAllColumns();
                this.byId("detailsTab").removeAllColumns();


                var oDelegateKeyUp = {
                    onkeyup: function (oEvent) {
                        that.onKeyUp(oEvent);
                    }
                };
                this.byId("mainTab").addEventDelegate(oDelegateKeyUp);
            },
            setSmartFilterModel: function () {
                //Model StyleHeaderFilters is for the smartfilterbar
                var oModel = this.getOwnerComponent().getModel("ZVB_3DERP_MHU_FILTERS_CDS");
                // console.log(oModel)
                var oSmartFilter = this.getView().byId("smartFilterBar");
                oSmartFilter.setModel(oModel);
            },
            getCols: async function () {
                var sPath = jQuery.sap.getModulePath("zuimhu", "/model/columns.json");
                var oModelColumns = new JSONModel();
                await oModelColumns.loadData(sPath);

                var oColumns = oModelColumns.getData();
                var oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(() => {
                    this.getDynamicColumns(oColumns, "MHU", "ZERP_HUHDR");
                    setTimeout(() => {
                        this.getDynamicColumns(oColumns, "MHUDTLS", "ZDV_MHUDTLS");
                    }, 100);

                });

            },
            getDynamicColumns(arg1, arg2, arg3) {
                var me = this;
                var oColumns = arg1;
                var modCode = arg2;
                var tabName = arg3;
                //get dynamic columns based on saved layout or ZERP_CHECK
                var oJSONColumnsModel = new JSONModel();
                var vSBU = 'VER';

                var oModel = this.getOwnerComponent().getModel("ZGW_3DERP_COMMON_SRV");
                // console.log(oModel)
                oModel.setHeaders({
                    sbu: vSBU,
                    type: modCode,
                    tabname: tabName
                });

                oModel.read("/ColumnsSet", {
                    success: function (oData, oResponse) {
                        oJSONColumnsModel.setData(oData);

                        if (oData.results.length > 0) {
                            if (modCode === 'MHU') {
                                var aColumns = me.setTableColumns(oColumns["MHU"], oData.results);
                                me._aColumns["MHU"] = aColumns["columns"];
                                me.addColumns(me.byId("mainTab"), aColumns["columns"], "MHU");
                            }
                            if (modCode === 'MHUDTLS') {
                                var aColumns = me.setTableColumns(oColumns["MHUDTLS"], oData.results);
                                me._aColumns["MHUDTLS"] = aColumns["columns"];
                                //me._aFilterableColumns["MHUDTLS"] = aColumns["filterableColumns"];
                                me.addColumns(me.byId("detailsTab"), aColumns["columns"], "MHUDTLS");
                            }
                        }
                    },
                    error: function (err) {
                        //me.closeLoadingDialog(that);
                    }
                });
            },
            addColumns(table, columns, model) {
                var aColumns = columns.filter(item => item.showable === true)
                aColumns.sort((a, b) => (a.position > b.position ? 1 : -1));
                aColumns.forEach(col => {
                    // console.log(col)
                    if (col.type === "STRING" || col.type === "DATETIME") {
                        table.addColumn(new sap.ui.table.Column({
                            //id: model + "Col" + col.name,
                            // id: col.name,
                            width: col.width,
                            sortProperty: col.name,
                            filterProperty: col.name,
                            label: new sap.m.Text({ text: col.label }),
                            template: new sap.m.Text({ text: "{" + model + ">" + col.name + "}" }),
                            visible: col.visible
                        }));
                    }
                    else if (col.type === "NUMBER") {
                        table.addColumn(new sap.ui.table.Column({
                            //id: model + "Col" + col.name,
                            width: col.width,
                            hAlign: "End",
                            sortProperty: col.name,
                            filterProperty: col.name,
                            label: new sap.m.Text({ text: col.label }),
                            template: new sap.m.Text({ text: "{" + model + ">" + col.name + "}" }),
                            visible: col.visible
                        }));
                    }
                    else if (col.type === "BOOLEAN") {
                        table.addColumn(new sap.ui.table.Column({
                            //id: model + "Col" + col.name,
                            width: col.width,
                            hAlign: "Center",
                            sortProperty: col.name,
                            filterProperty: col.name,
                            label: new sap.m.Text({ text: col.label }),
                            template: new sap.m.CheckBox({ selected: "{" + model + ">" + col.name + "}", editable: false }),
                            visible: col.visible
                        }));
                    }
                })
            },
            setTableColumns: function (arg1, arg2) {
                var oColumn = arg1;
                var oMetadata = arg2;

                var aSortableColumns = [];
                var aFilterableColumns = [];
                var aColumns = [];

                oMetadata.forEach((prop, idx) => {
                    var vCreatable = prop.Editable;
                    var vUpdatable = prop.Editable;
                    var vSortable = true;
                    var vSorted = prop.Sorted;
                    var vSortOrder = prop.SortOrder;
                    var vFilterable = true;
                    var vName = prop.ColumnLabel;
                    var oColumnLocalProp = oColumn.filter(col => col.name.toUpperCase() === prop.ColumnName);
                    var vShowable = true;
                    var vOrder = prop.Order;

                    // console.loetco(prop)
                    if (vShowable) {
                        //sortable
                        if (vSortable) {
                            aSortableColumns.push({
                                name: prop.ColumnName,
                                label: vName,
                                position: +vOrder,
                                sorted: vSorted,
                                sortOrder: vSortOrder
                            });
                        }

                        //filterable
                        if (vFilterable) {
                            aFilterableColumns.push({
                                name: prop.ColumnName,
                                label: vName,
                                position: +vOrder,
                                value: "",
                                connector: "Contains"
                            });
                        }
                    }

                    //columns
                    aColumns.push({
                        name: prop.ColumnName,
                        label: vName,
                        position: +vOrder,
                        type: prop.DataType,
                        creatable: vCreatable,
                        updatable: vUpdatable,
                        sortable: vSortable,
                        filterable: vFilterable,
                        visible: prop.Visible,
                        required: prop.Mandatory,
                        width: prop.ColumnWidth + 'rem',
                        sortIndicator: vSortOrder === '' ? "None" : vSortOrder,
                        hideOnChange: false,
                        valueHelp: oColumnLocalProp.length === 0 ? { "show": false } : oColumnLocalProp[0].valueHelp,
                        showable: vShowable,
                        key: prop.Key === '' ? false : true,
                        maxLength: prop.Length,
                        precision: prop.Decimal,
                        scale: prop.Scale !== undefined ? prop.Scale : null
                    })
                })

                /*aSortableColumns.sort((a,b) => (a.position > b.position ? 1 : -1));
                this.createViewSettingsDialog("sort", 
                    new JSONModel({
                        items: aSortableColumns,
                        rowCount: aSortableColumns.length,
                        activeRow: 0,
                        table: ""
                    })
                );

                aFilterableColumns.sort((a,b) => (a.position > b.position ? 1 : -1));
                this.createViewSettingsDialog("filter", 
                    new JSONModel({
                        items: aFilterableColumns,
                        rowCount: aFilterableColumns.length,
                        table: ""
                    })
                );*/

                aColumns.sort((a, b) => (a.position > b.position ? 1 : -1));
                var aColumnProp = aColumns.filter(item => item.showable === true);

                /*this.createViewSettingsDialog("column", 
                    new JSONModel({
                        items: aColumnProp,
                        rowCount: aColumnProp.length,
                        table: ""
                    })
                );*/


                //return { columns: aColumns, sortableColumns: aSortableColumns, filterableColumns: aFilterableColumns };
                return { columns: aColumns };
            },
            onSearch: function () {
                this.showLoadingDialog('Loading...');
                this.byId("mainTab").removeAllColumns();
                this.byId("detailsTab").removeAllColumns();
                this.setButton('LOAD');
                this.getCols();
                this.getMain();
            },
            getMain() {
                var oModel = this.getOwnerComponent().getModel();
                var aFilters = this.getView().byId("smartFilterBar").getFilters();
                console.log("aFilters",aFilters);
                var _this = this;
                oModel.read('/MainSet', {
                    filters: aFilters,
                    success: function (data, response) {
                        if (data.results.length > 0) {
                            data.results.forEach(item => {
                                item.CREATEDDT = dateFormat.format(item.CREATEDDT);
                                item.UPDATEDDT = dateFormat.format(item.UPDATEDDT);
                            })
                            data.results.sort((a, b) => new Date(b.CREATEDDT) - new Date(a.CREATEDDT) || parseInt(b.INTHUID) - parseInt(a.INTHUID));
                            _this.getView().getModel("ui").setProperty("/HUID", data.results[0].INTHUID);
                            _this.getDetails(data.results[0].INTHUID);
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData(data);
                            _this.getView().setModel(oJSONModel, "MHU");
                        }
                        else {
                            _this.getView().getModel("ui").setProperty("/HUID", "");
                            _this.getView().setModel(new JSONModel({
                                results: []
                            }), "MHU");

                            _this.getView().setModel(new JSONModel({
                                results: []
                            }), "MHUDTLS");
                            _this.closeLoadingDialog();
                        }
                    },
                    error: function (err) {
                        sap.m.MessageBox.warning(err.message);
                        _this.closeLoadingDialog();
                    }
                });
            },
            getDetails(HUID) {
                var oModel = this.getOwnerComponent().getModel();
                var _this = this;
                oModel.read('/DetailsSet', {
                    urlParameters: {
                        "$filter": "INTHUID eq '" + HUID + "'"
                    },
                    success: function (data, response) {
                        if (data.results.length > 0) {
                            data.results.forEach(item => {
                                item.CREATEDDT = dateFormat.format(item.CREATEDDT);
                                item.UPDATEDDT = dateFormat.format(item.UPDATEDDT);
                            })
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData(data);
                            _this.getView().setModel(oJSONModel, "MHUDTLS");
                        }
                        else {
                            _this.getView().setModel(new JSONModel({
                                results: []
                            }), "MHUDTLS");
                        }
                        _this.closeLoadingDialog();
                    },
                    error: function (err) {
                        sap.m.MessageBox.warning(err.message);
                    }
                });
            },
            onNewHdr() {
                this.setButton('NEW');
                this.setRowCreateMode('MHU')
            },
            onEditHdr() {
                this.setButton('EDIT');
                this.setRowEditMode();
            },
            onRowSelect: function (oEvent) {
                if (this.mode === 'INIT' || this.mode === 'READ') {
                    this.showLoadingDialog('Loading...');
                    var oTable = this.byId("mainTab");
                    var iSelectedIndex = oEvent.getSource().getSelectedIndex();
                    var sRowPath = oEvent.getParameters().rowContext.sPath;
                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext("MHU") && row.getBindingContext("MHU").sPath.replace("/results/", "") === sRowPath.replace("/results/", "")) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow");
                        //console.log(row.getBindingContext("MHU"));
                    });

                    oTable.setSelectedIndex(iSelectedIndex);
                    var context = oEvent.getParameter("rowContext");
                    var HUID = this.getView().getModel("MHU").getProperty("INTHUID", context);
                    this.getView().getModel("ui").setProperty("/HUID", HUID);
                    this.getDetails(HUID);
                }

            },
            onPurgeHdr() {
                var _this = this;
                var oTable = this.byId("mainTab");
                var aSelRows = oTable.getSelectedIndices();
                if (aSelRows.length === 0) {
                    MessageBox.information("No record(s) have been selected.");
                }
                else {
                    if (aSelRows.length > 1) {
                        this.byId("mainTab").clearSelection();
                        MessageBox.information("Please select one record only.");
                    }
                    else {
                        if (this.getView().getModel("MHUDTLS").getData().results.length > 0) {
                            aSelRows.forEach(rec => {
                                var oContext = oTable.getContextByIndex(rec);
                                var vHUID = oContext.getObject().INTHUID;
                                var oContext = oTable.getContextByIndex(rec);
                                sap.m.MessageBox.confirm("Are you sure you want to delete this item?", {
                                    actions: ["Yes", "No"],
                                    onClose: function (sAction) {
                                        if (sAction === "Yes") {
                                            _this.showLoadingDialog('Loading...');
                                            var oModel = _this.getOwnerComponent().getModel();
                                            var oEntitySet = "/MainSet(INTHUID='" + vHUID + "')";
                                            oModel.remove(oEntitySet, {
                                                success: function (data) {
                                                    sap.m.MessageBox.information("Handling Unit ID: " + vHUID + " has been successfully deleted!");
                                                    _this.closeLoadingDialog();
                                                    _this.setButton('LOAD');
                                                    _this.setRowReadMode();
                                                },
                                                error: function (err, oResponse) {
                                                    sap.m.MessageBox.warning(err.message);
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                        else {
                            MessageBox.information("Handling Unit not able to delete!");
                        }
                    }
                }
            },
            onRefreshMain() {
                this.showLoadingDialog('Loading...');
                this.getMain();
            },
            onRefreshDtls() {
                this.showLoadingDialog('Loading...');
                this.getDetails(this.getView().getModel("ui").getData().HUID);
            },
            onCellClickHdr: function (oEvent) {
                if (this.mode === 'INIT' || this.mode === 'READ') {
                    this.byId("mainTab").clearSelection();
                    var oTable = oEvent.getSource();
                    var sRowPath = oEvent.getParameters().rowBindingContext.sPath;
                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext("MHU") && row.getBindingContext("MHU").sPath.replace("/results/", "") === sRowPath.replace("/results/", "")) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow");
                    });
                    var INTHUID = oEvent.getParameters().rowBindingContext.getObject().INTHUID;
                    this.getView().getModel("ui").setProperty("/HUID", INTHUID);
                    this.showLoadingDialog('Loading...');
                    this.getDetails(INTHUID);
                }
            },
            onKeyUp(oEvent) {
                if ((oEvent.key === "ArrowUp" || oEvent.key === "ArrowDown") && oEvent.srcControl.sParentAggregationName === "rows") {
                    this.showLoadingDialog('Loading...');
                    var sRowPath = this.byId(oEvent.srcControl.sId).oBindingContexts["MHU"].sPath;
                    var oRow = this.getView().getModel("MHU").getProperty(sRowPath);
                    this.getView().getModel("ui").setProperty("/HUID", oRow.INTHUID);
                    this.getDetails(oRow.INTHUID);
                }
            },
            onSearchHeader: async function (oEvent) {
                var oTable = oEvent.getSource().oParent.oParent;
                var sTable = oTable.getBindingInfo("rows");
                var sQuery = oEvent.getParameter("query");

                var oFilter = null;
                var aFilter = [];
                var oTableSrc;
                var oColumnsModel;
                var oColumnsData;

                if (oTable.sId.includes("mainTab")) {

                }
            },
            onSaveHdr() {
                var _this = this;
                var aNewRows = this.getView().getModel("MHU").getData().results.filter(item => item.NEW === true);
                var aEditedRows = this.getView().getModel("MHU").getData().results.filter(item => item.EDITED === true);

                if (this.validationErrors.length === 0) {
                    if (aNewRows.length > 0) {
                        this.showLoadingDialog('Loading...');
                        var oModel = this.getOwnerComponent().getModel("ZGW_3DERP_RFC_SRV");
                        var oParam = {};
                        oParam["EReturnno"] = "";
                        oParam['N_GetNumberParam'] = [{
                            "INorangecd": "HU" + aNewRows[0].HUTYP,
                            "IKeycd": "",
                            "IUserid": "",
                        }];
                        oParam['N_GetNumberReturn'] = [];
                        oModel.create("/GetNumberSet", oParam, {
                            method: "POST",
                            success: function (oResult1, oResponse) {
                                //_this.getView().getModel("ui").setProperty("/HUID", oResult.EReturnno);
                                var oParamHdr = {
                                    "INTHUID": oResult1.EReturnno,
                                    "HUTYP": aNewRows[0].HUTYP,
                                    "HUGRP1": aNewRows[0].HUGRP1,
                                    "HUGRP2": aNewRows[0].HUGRP2,
                                    "WHSECD": aNewRows[0].WHSECD,
                                    "STORAREACD": aNewRows[0].STORAREACD,
                                    "BINCD": aNewRows[0].BINCD,
                                    "PLANTCD": aNewRows[0].PLANTCD,
                                    "SLOC": aNewRows[0].SLOC
                                }
                                var oModel = _this.getOwnerComponent().getModel();
                                oModel.create("/MainSet", oParamHdr, {
                                    method: "POST",
                                    success: function (oResult, oResponse) {
                                        //console.log(oResult);
                                        sap.m.MessageBox.information("Handling Unit ID: " + oResult1.EReturnno + " has been successfully saved!");
                                        _this.closeLoadingDialog();
                                        _this.setButton('LOAD');
                                        _this.setRowReadMode();
                                    },
                                    error: function (err, oResponse) {
                                        sap.m.MessageBox.warning(err.message);
                                    }

                                });
                            }
                        });

                        //alert(this.getView().getModel("ui").getData().HUID);
                    }
                    if (aEditedRows.length > 0) {
                        this.showLoadingDialog('Loading...');
                        var ctEditSuccess = 0;
                        aEditedRows.forEach(item => {
                            var oModel = _this.getOwnerComponent().getModel();
                            var oEntitySet = "/MainSet(INTHUID='" + item["INTHUID"] + "')";
                            var param = {};
                            param["HUTYP"] = item["HUTYP"],
                                param["HUGRP1"] = item["HUGRP1"],
                                param["HUGRP2"] = item["HUGRP2"],
                                param["WHSECD"] = item["WHSECD"],
                                param["STORAREACD"] = item["STORAREACD"],
                                param["BINCD"] = item["BINCD"],
                                param["PLANTCD"] = item["PLANTCD"],
                                param["SLOC"] = item["SLOC"]
                            console.log("aEditedRows", param);
                            oModel.update(oEntitySet, param, {
                                method: "PUT",
                                success: function (data, oResponse) {
                                    console.log(data);
                                    ctEditSuccess++;
                                    if (ctEditSuccess === aEditedRows.length) {
                                        sap.m.MessageBox.information("Handling Unit has been successfully updated!");
                                        _this.getView().getModel("MHU").setProperty("/", _this._oDataBeforeChange);
                                        _this.closeLoadingDialog();
                                        _this.setButton('LOAD');
                                        _this.setRowReadMode();
                                    }
                                }
                            });
                        });
                    }
                }
            },
            onCancelHdr() {
                this.setButton('CANCEL');
                this.setRowReadMode();
            },
            setRowEditMode() {
                var oTable = this.byId("mainTab");
                oTable.clearSelection();

                var aEditRows = this.getView().getModel("MHU").getData().results.filter(item => item.EDIT === true);
                if (aEditRows.length == 0) {
                    this._oDataBeforeChange = jQuery.extend(true, {}, this.getView().getModel("MHU").getData());
                }

                oTable.getColumns().forEach((col, idx) => {
                    this._aColumns["MHU"].filter(item => item.label === col.getLabel().getText())
                        .forEach(ci => {
                            if (!ci.hideOnChange && ci.updatable) {
                                if (ci.type === "BOOLEAN") {
                                    col.setTemplate(new sap.m.CheckBox({
                                        selected: "{MHU>" + ci.name + "}",
                                        select: this.onCheckBoxChange.bind(this),
                                        editable: true
                                    }));
                                }
                                else if (ci.valueHelp["show"]) {
                                    col.setTemplate(new sap.m.Input({
                                        // id: "ipt" + ci.name,
                                        type: "Text",
                                        value: "{MHU>" + ci.name + "}",
                                        maxLength: +ci.maxLength,
                                        showValueHelp: true,
                                        valueHelpRequest: this.handleValueHelp.bind(this),
                                        showSuggestion: true,
                                        maxSuggestionWidth: ci.valueHelp["suggestionItems"].additionalText !== undefined ? ci.valueHelp["suggestionItems"].maxSuggestionWidth : "1px",
                                        suggestionItems: {
                                            path: ci.valueHelp["items"].path, //ci.valueHelp.model + ">/items", //ci.valueHelp["suggestionItems"].path,
                                            length: 1000,
                                            template: new sap.ui.core.ListItem({
                                                key: "{" + ci.valueHelp["items"].value + "}", //"{" + ci.valueHelp.model + ">" + ci.valueHelp["items"].value + "}",
                                                text: "{" + ci.valueHelp["items"].value + "}", //"{" + ci.valueHelp.model + ">" + ci.valueHelp["items"].value + "}", //ci.valueHelp["suggestionItems"].text
                                                additionalText: ci.valueHelp["suggestionItems"].additionalText !== undefined ? ci.valueHelp["suggestionItems"].additionalText : '',
                                            }),
                                            templateShareable: false
                                        },
                                        change: this.onValueHelpLiveInputChange.bind(this)
                                    }));
                                }
                                else if (ci.type === "NUMBER") {
                                    col.setTemplate(new sap.m.Input({
                                        type: sap.m.InputType.Number,
                                        textAlign: sap.ui.core.TextAlign.Right,
                                        value: "{path:'MHU>" + ci.name + "', type:'sap.ui.model.odata.type.Decimal', formatOptions:{ minFractionDigits:" + ci.scale + ", maxFractionDigits:" + ci.scale + " }, constraints:{ precision:" + ci.precision + ", scale:" + ci.scale + " }}",
                                        liveChange: this.onNumberLiveChange.bind(this)
                                    }));
                                }
                                else if (ci.type === "DATETIME") {
                                    col.setTemplate(new sap.m.DatePicker({
                                        value: "{MHU>" + ci.name + "}",
                                        displayFormat: "MM/dd/yyyy",
                                        valueFormat: "yyyy-MM-dd",
                                        change: this.onDateChange.bind(this),
                                        // navigate: this.onClickDate.bind(this)
                                    }))
                                }
                                else {
                                    if (ci.maxLength !== null) {
                                        col.setTemplate(new sap.m.Input({
                                            value: "{MHU>" + ci.name + "}",
                                            maxLength: +ci.maxLength,
                                            liveChange: this.onInputLiveChange.bind(this)
                                        }));
                                    }
                                    else {
                                        col.setTemplate(new sap.m.Input({
                                            value: "{MHU>" + ci.name + "}",
                                            liveChange: this.onInputLiveChange.bind(this)
                                        }));
                                    }
                                }
                            }

                            if (ci.required) {
                                col.getLabel().addStyleClass("requiredField");
                            }
                        })
                })
            },
            setRowReadMode() {
                var oTable = this.byId("mainTab");
                oTable.getColumns().forEach((col, idx) => {
                    this._aColumns["MHU"].filter(item => item.label === col.getLabel().getText())
                        .forEach(ci => {
                            if (ci.type === "STRING" || ci.type === "NUMBER") {
                                col.setTemplate(new sap.m.Text({
                                    text: "{MHU>" + ci.name + "}",
                                    wrapping: false,
                                    tooltip: "{MHU>" + ci.name + "}"
                                }));
                            }
                            else if (ci.type === "BOOLEAN") {
                                col.setTemplate(new sap.m.CheckBox({ selected: "{MHU>" + ci.name + "}", editable: false }));
                            }

                            if (ci.required) {
                                col.getLabel().removeStyleClass("requiredField");
                            }
                        })
                })
                this.getMain();
            },
            setRowCreateMode(arg) {
                var aNewRows = this.getView().getModel("MHU").getData().results.filter(item => item.NEW === true);
                if (aNewRows.length == 0) {
                    this._oDataBeforeChange = jQuery.extend(true, {}, this.getView().getModel("MHU").getData());
                }
                var oNewRow = {};
                var oTable = this.byId("mainTab");
                oTable.getColumns().forEach((col, idx) => {
                    this._aColumns["MHU"].filter(item => item.label === col.getLabel().getText())
                        .forEach(ci => {
                            if (!ci.hideOnChange && ci.creatable) {
                                if (ci.type === "BOOLEAN") {
                                    col.setTemplate(new sap.m.CheckBox({
                                        selected: "{" + arg + ">" + ci.name + "}",
                                        select: this.onCheckBoxChange.bind(this),
                                        editable: true
                                    }));
                                }
                                else if (ci.valueHelp["show"]) {
                                    col.setTemplate(new sap.m.Input({
                                        type: "Text",
                                        value: "{" + arg + ">" + ci.name + "}",
                                        maxLength: +ci.maxLength,
                                        showValueHelp: true,
                                        valueHelpRequest: this.handleValueHelp.bind(this),
                                        showSuggestion: true,
                                        maxSuggestionWidth: ci.valueHelp["suggestionItems"].additionalText !== undefined ? ci.valueHelp["suggestionItems"].maxSuggestionWidth : "1px",
                                        suggestionItems: {
                                            path: ci.valueHelp["suggestionItems"].path,
                                            length: 1000,
                                            template: new sap.ui.core.ListItem({
                                                key: ci.valueHelp["suggestionItems"].text,
                                                text: ci.valueHelp["suggestionItems"].text,
                                                additionalText: ci.valueHelp["suggestionItems"].additionalText !== undefined ? ci.valueHelp["suggestionItems"].additionalText : '',
                                            }),
                                            templateShareable: false
                                        },
                                        change: this.onValueHelpLiveInputChange.bind(this)
                                    }));
                                }
                                else if (ci.type === "NUMBER") {
                                    col.setTemplate(new sap.m.Input({
                                        type: sap.m.InputType.Number,
                                        textAlign: sap.ui.core.TextAlign.Right,
                                        value: "{path:'" + arg + ">" + ci.name + "', type:'sap.ui.model.odata.type.Decimal', formatOptions:{ minFractionDigits:" + ci.scale + ", maxFractionDigits:" + ci.scale + " }, constraints:{ precision:" + ci.precision + ", scale:" + ci.scale + " }}",
                                        liveChange: this.onNumberLiveChange.bind(this)
                                    }));
                                }
                                else if (ci.type === "DATETIME") {
                                    col.setTemplate(new sap.m.DatePicker({
                                        value: "{" + arg + ">" + ci.name + "}",
                                        displayFormat: "MM/dd/yyyy",
                                        valueFormat: "yyyy-MM-dd",
                                        change: this.onDateChange.bind(this),
                                        // navigate: this.onClickDate.bind(this)
                                    }))
                                }
                                else {
                                    if (ci.maxLength !== null) {
                                        col.setTemplate(new sap.m.Input({
                                            value: "{" + arg + ">" + ci.name + "}",
                                            maxLength: +ci.maxLength,
                                            change: this.onInputLiveChange.bind(this)
                                        }));
                                    }
                                    else {
                                        col.setTemplate(new sap.m.Input({
                                            value: "{" + arg + ">" + ci.name + "}",
                                            change: this.onInputLiveChange.bind(this)
                                        }));
                                    }
                                }
                            }

                            if (ci.required) {
                                col.getLabel().addStyleClass("requiredField");
                            }

                            if (ci.type === "STRING") oNewRow[ci.name] = "";
                            //else if (ci.type === "NUMBER") oNewRow[ci.name] = "0";
                            else if (ci.type === "BOOLEAN") oNewRow[ci.name] = false;
                        });
                });
                oNewRow["NEW"] = true;
                aNewRows.push(oNewRow);
                this.getView().getModel("MHU").setProperty("/results", aNewRows);
                this.byId(arg + "Tab").getBinding("rows").filter(null, "Application");
            },
            handleValueHelp: function (oEvent) {
                var _this = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSource = oEvent.getSource();
                var sEntity = oSource.getBindingInfo("suggestionItems").path;
                var sModel = oSource.getBindingInfo("value").parts[0].model;
                this._inputId = oSource.getId();
                this._inputValue = oSource.getValue();
                this._inputSource = oSource;
                this._inputField = oSource.getBindingInfo("value").parts[0].path;
                this.dialogEntity = sEntity;

                switch (sEntity) {
                    case "/HUTypeSHSet":
                        oModel.read('/HUTypeSHSet', {
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.Hutyp;
                                    item.VHDesc = item.Shorttext;
                                    item.VHDesc2 = item.Shorttext;
                                    item.VHSelected = (item.Hutyp === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select Handling Unit Type");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Handling Unit Type" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Handling Unit Type" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                    case "/PlantSHSet":
                        oModel.read('/PlantSHSet', {
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.Plantcd;
                                    item.VHDesc = item.Name1;
                                    item.VHDesc2 = item.Name1;
                                    item.VHSelected = (item.Plantcd === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select Plant");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Plant" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Plant" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                    case "/StorageLocSHSet":
                        oModel.read('/StorageLocSHSet', {
                            urlParameters: {
                                "$filter": "PLANTCD eq '" + this.getView().getModel("ui").getData().PLANTCD + "'"
                            },
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.SLOC;
                                    item.VHDesc = item.SHORTTEXT;
                                    item.VHDesc2 = item.SHORTTEXT;
                                    item.VHSelected = (item.SLOC === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select Storage Location");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Storage Location" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Storage Location" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                    case "/WarehouseSHSet":
                        oModel.read('/WarehouseSHSet', {
                            urlParameters: {
                                "$filter": "STORAREACD eq '" + this.getView().getModel("ui").getData().STORAREACD + "' and PLANTCD eq '" + this.getView().getModel("ui").getData().PLANTCD + "'"
                            },
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.WHSECD;
                                    item.VHDesc = "";
                                    item.VHDesc2 = "";
                                    item.VHSelected = (item.WHSECD === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select Warehouse");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Warehouse" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Warehouse" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                    case "/StoreAreaSHSet":
                        oModel.read('/StoreAreaSHSet', {
                            urlParameters: {
                                "$filter": "WHSECD eq '" + this.getView().getModel("ui").getData().WHSECD + "'"
                            },
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.STORARECD;
                                    item.VHDesc = "";
                                    item.VHDesc2 = "";
                                    item.VHSelected = (item.STORARECD === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select Store Area Code");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Store Area Code" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "Store Area Code" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                    case "/BinCodeSHSet":
                        oModel.read('/BinCodeSHSet', {
                            urlParameters: {
                                "$filter": "WHSECD eq '" + this.getView().getModel("ui").getData().WHSECD + "'"
                            },
                            success: function (data, response) {
                                data.results.forEach(item => {
                                    item.VHTitle = item.BINCD;
                                    item.VHDesc = "";
                                    item.VHDesc2 = "";
                                    item.VHSelected = (item.BINCD === _this._inputValue);
                                });
                                data.results.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));
                                if (!_this._valueHelpDialog) {
                                    _this._valueHelpDialog = sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog", _this).setProperty("title", "Select BIN Code");
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "BIN Code" }))
                                    _this.getView().addDependent(_this._valueHelpDialog);
                                }
                                else {
                                    _this._valueHelpDialog.setModel(new JSONModel({ items: data.results, title: "BIN Code" }))
                                }
                                _this._valueHelpDialog.open();
                            }
                        });
                        break;
                }

            },
            handleValueHelpClose: function (oEvent) {
                var oModel = this.getOwnerComponent().getModel();
                if (oEvent.sId === "confirm") {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    var _this = this;
                    if (oSelectedItem) {
                        this._inputSource.setValue(oSelectedItem.getTitle());
                        switch (this.dialogEntity) {
                            case "/PlantSHSet":
                                this.getView().getModel("ui").setProperty("/PLANTCD", oSelectedItem.getTitle());
                                break;
                            case "/StorageLocSHSet":
                                this.getView().getModel("ui").setProperty("/SLOC", oSelectedItem.getTitle());
                                oModel.read('/StorageLocSHSet', {
                                    urlParameters: {
                                        "$filter": "PLANTCD eq '" + this.getView().getModel("ui").getData().PLANTCD + "' and SLOC eq '" + oSelectedItem.getTitle() + "'"
                                    },
                                    success: function (data, response) {
                                        _this.getView().getModel("ui").setProperty("/STORAREACD", data.results[0].STORAREACD);
                                        _this.getView().getModel("ui").setProperty("/WHSECD", data.results[0].WHSECD);
                                        //alert(this.getView().getModel("ui").getData().STORAREACD);
                                    }
                                });
                                break;
                        }
                    }
                }
            },
            handleValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("VHTitle", sap.ui.model.FilterOperator.Contains, sValue),
                        new sap.ui.model.Filter("VHDesc", sap.ui.model.FilterOperator.Contains, sValue)
                    ],
                    and: false
                });

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onValueHelpLiveInputChange: function (oEvent) {
                if (this.validationErrors === undefined) this.validationErrors = [];
                var oSource = oEvent.getSource();
                var isInvalid = !oSource.getSelectedKey() && oSource.getValue().trim();
                oSource.setValueState(isInvalid ? "Error" : "None");

                if (!oSource.getSelectedKey()) {
                    oSource.getSuggestionItems().forEach(item => {
                        // console.log(item.getProperty("key"), oSource.getValue().trim())
                        if (item.getProperty("key") === oSource.getValue().trim()) {
                            isInvalid = false;
                            oSource.setValueState(isInvalid ? "Error" : "None");
                        }
                    })
                }

                this.addRemoveValueState(!isInvalid, oSource.getId());

                var sRowPath = oSource.getBindingInfo("value").binding.oContext.sPath;
                var sModel = oSource.getBindingInfo("value").parts[0].model;
                var sColumn = oSource.getBindingInfo("value").parts[0].path;
                this.getView().getModel(sModel).setProperty(sRowPath + '/' + sColumn, oSource.mProperties.selectedKey);
                this.getView().getModel(sModel).setProperty(sRowPath + '/EDITED', true);
            },
            onInputLiveChange: function (oEvent) {
                var oSource = oEvent.getSource();
                var sRowPath = oSource.getBindingInfo("value").binding.oContext.sPath;
                var sModel = oSource.getBindingInfo("value").parts[0].model;

                this.getView().getModel(sModel).setProperty(sRowPath + '/EDITED', true);
            },
            addRemoveValueState(pIsValid, pId) {
                //console.log("addRemoveValueState", this._aInvalidValueState, pIsValid, pId)
                if (!pIsValid) {
                    if (!this._aInvalidValueState.includes(pId)) {
                        this._aInvalidValueState.push(pId);
                    }
                } else {
                    if (this._aInvalidValueState.includes(pId)) {
                        for (var i = this._aInvalidValueState.length - 1; i >= 0; i--) {
                            if (this._aInvalidValueState[i] == pId) {
                                this._aInvalidValueState.splice(i, 1)
                            }

                        }
                    }
                }
            },
            setButton(mode) {
                switch (mode) {
                    case 'EDIT':
                    case 'NEW':
                        this.mode = 'EDIT';
                        this.byId("smartFilterBar").setVisible(false);
                        this.byId("detailsTab").setVisible(false);
                        this.byId("btnSaveMain").setVisible(true);
                        this.byId("btnCancelMain").setVisible(true);
                        this.byId("searchFieldMain").setVisible(false);
                        this.byId("btnNewMain").setVisible(false);
                        this.byId("btnEditMain").setVisible(false);
                        this.byId("btnPurgeMain").setVisible(false);
                        this.byId("btnSetStatus").setVisible(false);
                        this.byId("btnRefreshMain").setVisible(false);
                        this.byId("btnExportExcel").setVisible(false);
                        this.byId("btnSaveLayout").setVisible(false);
                        break;
                    case 'LOAD':
                    case 'CANCEL':
                        this.mode = 'READ';
                        this.byId("btnSaveMain").setVisible(false);
                        this.byId("btnCancelMain").setVisible(false);
                        this.byId("searchFieldMain").setVisible(true);
                        this.byId("btnNewMain").setVisible(true);
                        this.byId("btnEditMain").setVisible(true);
                        this.byId("btnPurgeMain").setVisible(true);
                        this.byId("btnSetStatus").setVisible(true);
                        this.byId("btnRefreshMain").setVisible(true);
                        this.byId("btnExportExcel").setVisible(true);
                        this.byId("btnSaveLayout").setVisible(true);
                        this.byId("btnNewMain").setEnabled(true);
                        this.byId("btnEditMain").setEnabled(true);
                        this.byId("btnPurgeMain").setEnabled(true);
                        this.byId("btnSetStatus").setEnabled(true);
                        this.byId("btnRefreshMain").setEnabled(true);
                        this.byId("btnExportExcel").setEnabled(true);
                        this.byId("btnSaveLayout").setEnabled(true);
                        this.byId("btnRefreshDtls").setEnabled(true);
                        this.byId("smartFilterBar").setVisible(true);
                        this.byId("detailsTab").setVisible(true);
                        break;
                    case 'INIT':
                        this.mode = 'INIT';
                        this.byId("btnSaveMain").setVisible(false);
                        this.byId("btnCancelMain").setVisible(false);
                        this.byId("searchFieldMain").setVisible(true);
                        this.byId("btnNewMain").setEnabled(false);
                        this.byId("btnEditMain").setEnabled(false);
                        this.byId("btnPurgeMain").setEnabled(false);
                        this.byId("btnSetStatus").setEnabled(false);
                        this.byId("btnRefreshMain").setEnabled(false);
                        this.byId("btnExportExcel").setEnabled(false);
                        this.byId("btnSaveLayout").setEnabled(false);
                        this.byId("btnRefreshDtls").setEnabled(false);
                        break;
                    default:
                    // code block
                }
            },
            showLoadingDialog(arg) {
                if (!this._LoadingDialog) {
                    this._LoadingDialog = sap.ui.xmlfragment("zuimhu.view.fragments.LoadingDialog", this);
                    this.getView().addDependent(this._LoadingDialog);
                }
                this._LoadingDialog.setTitle(arg);
                this._LoadingDialog.open();
            },
            closeLoadingDialog() {
                this._LoadingDialog.close();
            },
        });
    });
