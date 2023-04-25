//@ui5-bundle zuimhu/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"zuimhu/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","zuimhu/model/models"],function(e,i,t){"use strict";return e.extend("zuimhu.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
},
	"zuimhu/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("zuimhu.controller.App",{onInit(){}})});
},
	"zuimhu/controller/main.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageBox","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/Sorter","sap/ui/Device","sap/ui/table/library","sap/ui/core/Fragment","jquery.sap.global"],function(e,t,a,i,s,l,n,o,r,u){"use strict";var d;var g=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy"});var h=sap.ui.core.format.DateFormat.getDateInstance({pattern:"YYYY-MM-ddTHH:mm:ss",UTC:false});return e.extend("zuimhu.controller.main",{onInit:function(){d=this;this.validationErrors=[];this.setButton("INIT");this._oModel=this.getOwnerComponent().getModel();this.getView().setModel(new t({SBU:"",PLANTCD:"",SLOC:"",STORAREACD:"",WHSECD:"",HUID:""}),"ui");this.setSmartFilterModel();var e=this.getOwnerComponent().getModel("ZVB_3DERP_MHU_FILTERS_CDS");e.read("/ZVB_3DERP_SBU_SH",{success:function(e,t){if(e.results.length===1){d.getView().getModel("ui").setProperty("/sbu",e.results[0].SBU)}else{}},error:function(e){}});this._aColumns={};this._aFilterableColumns={};this._oDataBeforeChange={};this._aDataBeforeChange=[];this._aInvalidValueState=[];this.byId("mainTab").removeAllColumns();this.byId("detailsTab").removeAllColumns();var a={onkeyup:function(e){d.onKeyUp(e)}};this.byId("mainTab").addEventDelegate(a)},setSmartFilterModel:function(){var e=this.getOwnerComponent().getModel("ZVB_3DERP_MHU_FILTERS_CDS");var t=this.getView().byId("smartFilterBar");t.setModel(e)},getCols:async function(){var e=u.sap.getModulePath("zuimhu","/model/columns.json");var a=new t;await a.loadData(e);var i=a.getData();var s=this.getOwnerComponent().getModel();s.metadataLoaded().then(()=>{this.getDynamicColumns(i,"MHU","ZERP_HUHDR");setTimeout(()=>{this.getDynamicColumns(i,"MHUDTLS","ZDV_MHUDTLS")},100)})},getDynamicColumns(e,a,i){var s=this;var l=e;var n=a;var o=i;var r=new t;var u="VER";var d=this.getOwnerComponent().getModel("ZGW_3DERP_COMMON_SRV");d.setHeaders({sbu:u,type:n,tabname:o});d.read("/ColumnsSet",{success:function(e,t){r.setData(e);if(e.results.length>0){if(n==="MHU"){var a=s.setTableColumns(l["MHU"],e.results);s._aColumns["MHU"]=a["columns"];s.addColumns(s.byId("mainTab"),a["columns"],"MHU")}if(n==="MHUDTLS"){var a=s.setTableColumns(l["MHUDTLS"],e.results);s._aColumns["MHUDTLS"]=a["columns"];s.addColumns(s.byId("detailsTab"),a["columns"],"MHUDTLS")}}},error:function(e){}})},addColumns(e,t,a){var i=t.filter(e=>e.showable===true);i.sort((e,t)=>e.position>t.position?1:-1);i.forEach(t=>{if(t.type==="STRING"||t.type==="DATETIME"){e.addColumn(new sap.ui.table.Column({width:t.width,sortProperty:t.name,filterProperty:t.name,label:new sap.m.Text({text:t.label}),template:new sap.m.Text({text:"{"+a+">"+t.name+"}"}),visible:t.visible}))}else if(t.type==="NUMBER"){e.addColumn(new sap.ui.table.Column({width:t.width,hAlign:"End",sortProperty:t.name,filterProperty:t.name,label:new sap.m.Text({text:t.label}),template:new sap.m.Text({text:"{"+a+">"+t.name+"}"}),visible:t.visible}))}else if(t.type==="BOOLEAN"){e.addColumn(new sap.ui.table.Column({width:t.width,hAlign:"Center",sortProperty:t.name,filterProperty:t.name,label:new sap.m.Text({text:t.label}),template:new sap.m.CheckBox({selected:"{"+a+">"+t.name+"}",editable:false}),visible:t.visible}))}})},setTableColumns:function(e,t){var a=e;var i=t;var s=[];var l=[];var n=[];i.forEach((e,t)=>{var i=e.Editable;var o=e.Editable;var r=true;var u=e.Sorted;var d=e.SortOrder;var g=true;var h=e.ColumnLabel;var p=a.filter(t=>t.name.toUpperCase()===e.ColumnName);var m=true;var c=e.Order;if(m){if(r){s.push({name:e.ColumnName,label:h,position:+c,sorted:u,sortOrder:d})}if(g){l.push({name:e.ColumnName,label:h,position:+c,value:"",connector:"Contains"})}}n.push({name:e.ColumnName,label:h,position:+c,type:e.DataType,creatable:i,updatable:o,sortable:r,filterable:g,visible:e.Visible,required:e.Mandatory,width:e.ColumnWidth+"rem",sortIndicator:d===""?"None":d,hideOnChange:false,valueHelp:p.length===0?{show:false}:p[0].valueHelp,showable:m,key:e.Key===""?false:true,maxLength:e.Length,precision:e.Decimal,scale:e.Scale!==undefined?e.Scale:null})});n.sort((e,t)=>e.position>t.position?1:-1);var o=n.filter(e=>e.showable===true);return{columns:n}},onSearch:function(){this.showLoadingDialog("Loading...");this.byId("mainTab").removeAllColumns();this.byId("detailsTab").removeAllColumns();this.setButton("LOAD");this.getCols();this.getMain()},getMain(){var e=this.getOwnerComponent().getModel();var a=this.getView().byId("smartFilterBar").getFilters();console.log("aFilters",a);var i=this;e.read("/MainSet",{filters:a,success:function(e,a){if(e.results.length>0){e.results.forEach(e=>{e.CREATEDDT=g.format(e.CREATEDDT);e.UPDATEDDT=g.format(e.UPDATEDDT)});e.results.sort((e,t)=>new Date(t.CREATEDDT)-new Date(e.CREATEDDT)||parseInt(t.INTHUID)-parseInt(e.INTHUID));i.getView().getModel("ui").setProperty("/HUID",e.results[0].INTHUID);i.getDetails(e.results[0].INTHUID);var s=new sap.ui.model.json.JSONModel;s.setData(e);i.getView().setModel(s,"MHU")}else{i.getView().getModel("ui").setProperty("/HUID","");i.getView().setModel(new t({results:[]}),"MHU");i.getView().setModel(new t({results:[]}),"MHUDTLS");i.closeLoadingDialog()}},error:function(e){sap.m.MessageBox.warning(e.message);i.closeLoadingDialog()}})},getDetails(e){var a=this.getOwnerComponent().getModel();var i=this;a.read("/DetailsSet",{urlParameters:{$filter:"INTHUID eq '"+e+"'"},success:function(e,a){if(e.results.length>0){e.results.forEach(e=>{e.CREATEDDT=g.format(e.CREATEDDT);e.UPDATEDDT=g.format(e.UPDATEDDT)});var s=new sap.ui.model.json.JSONModel;s.setData(e);i.getView().setModel(s,"MHUDTLS")}else{i.getView().setModel(new t({results:[]}),"MHUDTLS")}i.closeLoadingDialog()},error:function(e){sap.m.MessageBox.warning(e.message)}})},onNewHdr(){this.setButton("NEW");this.setRowCreateMode("MHU")},onEditHdr(){this.setButton("EDIT");this.setRowEditMode()},onRowSelect:function(e){if(this.mode==="INIT"||this.mode==="READ"){this.showLoadingDialog("Loading...");var t=this.byId("mainTab");var a=e.getSource().getSelectedIndex();var i=e.getParameters().rowContext.sPath;t.getRows().forEach(e=>{if(e.getBindingContext("MHU")&&e.getBindingContext("MHU").sPath.replace("/results/","")===i.replace("/results/","")){e.addStyleClass("activeRow")}else e.removeStyleClass("activeRow")});t.setSelectedIndex(a);var s=e.getParameter("rowContext");var l=this.getView().getModel("MHU").getProperty("INTHUID",s);this.getView().getModel("ui").setProperty("/HUID",l);this.getDetails(l)}},onPurgeHdr(){var e=this;var t=this.byId("mainTab");var i=t.getSelectedIndices();if(i.length===0){a.information("No record(s) have been selected.")}else{if(i.length>1){this.byId("mainTab").clearSelection();a.information("Please select one record only.")}else{if(this.getView().getModel("MHUDTLS").getData().results.length>0){i.forEach(a=>{var i=t.getContextByIndex(a);var s=i.getObject().INTHUID;var i=t.getContextByIndex(a);sap.m.MessageBox.confirm("Are you sure you want to delete this item?",{actions:["Yes","No"],onClose:function(t){if(t==="Yes"){e.showLoadingDialog("Loading...");var a=e.getOwnerComponent().getModel();var i="/MainSet(INTHUID='"+s+"')";a.remove(i,{success:function(t){sap.m.MessageBox.information("Handling Unit ID: "+s+" has been successfully deleted!");e.closeLoadingDialog();e.setButton("LOAD");e.setRowReadMode()},error:function(e,t){sap.m.MessageBox.warning(e.message)}})}}})})}else{a.information("Handling Unit not able to delete!")}}}},onRefreshMain(){this.showLoadingDialog("Loading...");this.getMain()},onRefreshDtls(){this.showLoadingDialog("Loading...");this.getDetails(this.getView().getModel("ui").getData().HUID)},onCellClickHdr:function(e){if(this.mode==="INIT"||this.mode==="READ"){this.byId("mainTab").clearSelection();var t=e.getSource();var a=e.getParameters().rowBindingContext.sPath;t.getRows().forEach(e=>{if(e.getBindingContext("MHU")&&e.getBindingContext("MHU").sPath.replace("/results/","")===a.replace("/results/","")){e.addStyleClass("activeRow")}else e.removeStyleClass("activeRow")});var i=e.getParameters().rowBindingContext.getObject().INTHUID;this.getView().getModel("ui").setProperty("/HUID",i);this.showLoadingDialog("Loading...");this.getDetails(i)}},onKeyUp(e){if((e.key==="ArrowUp"||e.key==="ArrowDown")&&e.srcControl.sParentAggregationName==="rows"){this.showLoadingDialog("Loading...");var t=this.byId(e.srcControl.sId).oBindingContexts["MHU"].sPath;var a=this.getView().getModel("MHU").getProperty(t);this.getView().getModel("ui").setProperty("/HUID",a.INTHUID);this.getDetails(a.INTHUID)}},onSearchHeader:async function(e){var t=e.getSource().oParent.oParent;var a=t.getBindingInfo("rows");var i=e.getParameter("query");var s=null;var l=[];var n;var o;var r;if(t.sId.includes("mainTab")){}},onSaveHdr(){var e=this;var t=this.getView().getModel("MHU").getData().results.filter(e=>e.NEW===true);var a=this.getView().getModel("MHU").getData().results.filter(e=>e.EDITED===true);if(this.validationErrors.length===0){if(t.length>0){this.showLoadingDialog("Loading...");var i=this.getOwnerComponent().getModel("ZGW_3DERP_RFC_SRV");var s={};s["EReturnno"]="";s["N_GetNumberParam"]=[{INorangecd:"HU"+t[0].HUTYP,IKeycd:"",IUserid:""}];s["N_GetNumberReturn"]=[];i.create("/GetNumberSet",s,{method:"POST",success:function(a,i){var s={INTHUID:a.EReturnno,HUTYP:t[0].HUTYP,HUGRP1:t[0].HUGRP1,HUGRP2:t[0].HUGRP2,WHSECD:t[0].WHSECD,STORAREACD:t[0].STORAREACD,BINCD:t[0].BINCD,PLANTCD:t[0].PLANTCD,SLOC:t[0].SLOC};var l=e.getOwnerComponent().getModel();l.create("/MainSet",s,{method:"POST",success:function(t,i){sap.m.MessageBox.information("Handling Unit ID: "+a.EReturnno+" has been successfully saved!");e.closeLoadingDialog();e.setButton("LOAD");e.setRowReadMode()},error:function(e,t){sap.m.MessageBox.warning(e.message)}})}})}if(a.length>0){this.showLoadingDialog("Loading...");var l=0;a.forEach(t=>{var i=e.getOwnerComponent().getModel();var s="/MainSet(INTHUID='"+t["INTHUID"]+"')";var n={};n["HUTYP"]=t["HUTYP"],n["HUGRP1"]=t["HUGRP1"],n["HUGRP2"]=t["HUGRP2"],n["WHSECD"]=t["WHSECD"],n["STORAREACD"]=t["STORAREACD"],n["BINCD"]=t["BINCD"],n["PLANTCD"]=t["PLANTCD"],n["SLOC"]=t["SLOC"];console.log("aEditedRows",n);i.update(s,n,{method:"PUT",success:function(t,i){console.log(t);l++;if(l===a.length){sap.m.MessageBox.information("Handling Unit has been successfully updated!");e.getView().getModel("MHU").setProperty("/",e._oDataBeforeChange);e.closeLoadingDialog();e.setButton("LOAD");e.setRowReadMode()}}})})}}},onCancelHdr(){this.setButton("CANCEL");this.setRowReadMode()},setRowEditMode(){var e=this.byId("mainTab");e.clearSelection();var t=this.getView().getModel("MHU").getData().results.filter(e=>e.EDIT===true);if(t.length==0){this._oDataBeforeChange=u.extend(true,{},this.getView().getModel("MHU").getData())}e.getColumns().forEach((e,t)=>{this._aColumns["MHU"].filter(t=>t.label===e.getLabel().getText()).forEach(t=>{if(!t.hideOnChange&&t.updatable){if(t.type==="BOOLEAN"){e.setTemplate(new sap.m.CheckBox({selected:"{MHU>"+t.name+"}",select:this.onCheckBoxChange.bind(this),editable:true}))}else if(t.valueHelp["show"]){e.setTemplate(new sap.m.Input({type:"Text",value:"{MHU>"+t.name+"}",maxLength:+t.maxLength,showValueHelp:true,valueHelpRequest:this.handleValueHelp.bind(this),showSuggestion:true,maxSuggestionWidth:t.valueHelp["suggestionItems"].additionalText!==undefined?t.valueHelp["suggestionItems"].maxSuggestionWidth:"1px",suggestionItems:{path:t.valueHelp["items"].path,length:1e3,template:new sap.ui.core.ListItem({key:"{"+t.valueHelp["items"].value+"}",text:"{"+t.valueHelp["items"].value+"}",additionalText:t.valueHelp["suggestionItems"].additionalText!==undefined?t.valueHelp["suggestionItems"].additionalText:""}),templateShareable:false},change:this.onValueHelpLiveInputChange.bind(this)}))}else if(t.type==="NUMBER"){e.setTemplate(new sap.m.Input({type:sap.m.InputType.Number,textAlign:sap.ui.core.TextAlign.Right,value:"{path:'MHU>"+t.name+"', type:'sap.ui.model.odata.type.Decimal', formatOptions:{ minFractionDigits:"+t.scale+", maxFractionDigits:"+t.scale+" }, constraints:{ precision:"+t.precision+", scale:"+t.scale+" }}",liveChange:this.onNumberLiveChange.bind(this)}))}else if(t.type==="DATETIME"){e.setTemplate(new sap.m.DatePicker({value:"{MHU>"+t.name+"}",displayFormat:"MM/dd/yyyy",valueFormat:"yyyy-MM-dd",change:this.onDateChange.bind(this)}))}else{if(t.maxLength!==null){e.setTemplate(new sap.m.Input({value:"{MHU>"+t.name+"}",maxLength:+t.maxLength,liveChange:this.onInputLiveChange.bind(this)}))}else{e.setTemplate(new sap.m.Input({value:"{MHU>"+t.name+"}",liveChange:this.onInputLiveChange.bind(this)}))}}}if(t.required){e.getLabel().addStyleClass("requiredField")}})})},setRowReadMode(){var e=this.byId("mainTab");e.getColumns().forEach((e,t)=>{this._aColumns["MHU"].filter(t=>t.label===e.getLabel().getText()).forEach(t=>{if(t.type==="STRING"||t.type==="NUMBER"){e.setTemplate(new sap.m.Text({text:"{MHU>"+t.name+"}",wrapping:false,tooltip:"{MHU>"+t.name+"}"}))}else if(t.type==="BOOLEAN"){e.setTemplate(new sap.m.CheckBox({selected:"{MHU>"+t.name+"}",editable:false}))}if(t.required){e.getLabel().removeStyleClass("requiredField")}})});this.getMain()},setRowCreateMode(e){var t=this.getView().getModel("MHU").getData().results.filter(e=>e.NEW===true);if(t.length==0){this._oDataBeforeChange=u.extend(true,{},this.getView().getModel("MHU").getData())}var a={};var i=this.byId("mainTab");i.getColumns().forEach((t,i)=>{this._aColumns["MHU"].filter(e=>e.label===t.getLabel().getText()).forEach(i=>{if(!i.hideOnChange&&i.creatable){if(i.type==="BOOLEAN"){t.setTemplate(new sap.m.CheckBox({selected:"{"+e+">"+i.name+"}",select:this.onCheckBoxChange.bind(this),editable:true}))}else if(i.valueHelp["show"]){t.setTemplate(new sap.m.Input({type:"Text",value:"{"+e+">"+i.name+"}",maxLength:+i.maxLength,showValueHelp:true,valueHelpRequest:this.handleValueHelp.bind(this),showSuggestion:true,maxSuggestionWidth:i.valueHelp["suggestionItems"].additionalText!==undefined?i.valueHelp["suggestionItems"].maxSuggestionWidth:"1px",suggestionItems:{path:i.valueHelp["suggestionItems"].path,length:1e3,template:new sap.ui.core.ListItem({key:i.valueHelp["suggestionItems"].text,text:i.valueHelp["suggestionItems"].text,additionalText:i.valueHelp["suggestionItems"].additionalText!==undefined?i.valueHelp["suggestionItems"].additionalText:""}),templateShareable:false},change:this.onValueHelpLiveInputChange.bind(this)}))}else if(i.type==="NUMBER"){t.setTemplate(new sap.m.Input({type:sap.m.InputType.Number,textAlign:sap.ui.core.TextAlign.Right,value:"{path:'"+e+">"+i.name+"', type:'sap.ui.model.odata.type.Decimal', formatOptions:{ minFractionDigits:"+i.scale+", maxFractionDigits:"+i.scale+" }, constraints:{ precision:"+i.precision+", scale:"+i.scale+" }}",liveChange:this.onNumberLiveChange.bind(this)}))}else if(i.type==="DATETIME"){t.setTemplate(new sap.m.DatePicker({value:"{"+e+">"+i.name+"}",displayFormat:"MM/dd/yyyy",valueFormat:"yyyy-MM-dd",change:this.onDateChange.bind(this)}))}else{if(i.maxLength!==null){t.setTemplate(new sap.m.Input({value:"{"+e+">"+i.name+"}",maxLength:+i.maxLength,change:this.onInputLiveChange.bind(this)}))}else{t.setTemplate(new sap.m.Input({value:"{"+e+">"+i.name+"}",change:this.onInputLiveChange.bind(this)}))}}}if(i.required){t.getLabel().addStyleClass("requiredField")}if(i.type==="STRING")a[i.name]="";else if(i.type==="BOOLEAN")a[i.name]=false})});a["NEW"]=true;t.push(a);this.getView().getModel("MHU").setProperty("/results",t);this.byId(e+"Tab").getBinding("rows").filter(null,"Application")},handleValueHelp:function(e){var a=this;var i=this.getOwnerComponent().getModel();var s=e.getSource();var l=s.getBindingInfo("suggestionItems").path;var n=s.getBindingInfo("value").parts[0].model;this._inputId=s.getId();this._inputValue=s.getValue();this._inputSource=s;this._inputField=s.getBindingInfo("value").parts[0].path;this.dialogEntity=l;switch(l){case"/HUTypeSHSet":i.read("/HUTypeSHSet",{success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.Hutyp;e.VHDesc=e.Shorttext;e.VHDesc2=e.Shorttext;e.VHSelected=e.Hutyp===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select Handling Unit Type");a._valueHelpDialog.setModel(new t({items:e.results,title:"Handling Unit Type"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"Handling Unit Type"}))}a._valueHelpDialog.open()}});break;case"/PlantSHSet":i.read("/PlantSHSet",{success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.Plantcd;e.VHDesc=e.Name1;e.VHDesc2=e.Name1;e.VHSelected=e.Plantcd===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select Plant");a._valueHelpDialog.setModel(new t({items:e.results,title:"Plant"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"Plant"}))}a._valueHelpDialog.open()}});break;case"/StorageLocSHSet":i.read("/StorageLocSHSet",{urlParameters:{$filter:"PLANTCD eq '"+this.getView().getModel("ui").getData().PLANTCD+"'"},success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.SLOC;e.VHDesc=e.SHORTTEXT;e.VHDesc2=e.SHORTTEXT;e.VHSelected=e.SLOC===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select Storage Location");a._valueHelpDialog.setModel(new t({items:e.results,title:"Storage Location"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"Storage Location"}))}a._valueHelpDialog.open()}});break;case"/WarehouseSHSet":i.read("/WarehouseSHSet",{urlParameters:{$filter:"STORAREACD eq '"+this.getView().getModel("ui").getData().STORAREACD+"' and PLANTCD eq '"+this.getView().getModel("ui").getData().PLANTCD+"'"},success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.WHSECD;e.VHDesc="";e.VHDesc2="";e.VHSelected=e.WHSECD===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select Warehouse");a._valueHelpDialog.setModel(new t({items:e.results,title:"Warehouse"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"Warehouse"}))}a._valueHelpDialog.open()}});break;case"/StoreAreaSHSet":i.read("/StoreAreaSHSet",{urlParameters:{$filter:"WHSECD eq '"+this.getView().getModel("ui").getData().WHSECD+"'"},success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.STORARECD;e.VHDesc="";e.VHDesc2="";e.VHSelected=e.STORARECD===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select Store Area Code");a._valueHelpDialog.setModel(new t({items:e.results,title:"Store Area Code"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"Store Area Code"}))}a._valueHelpDialog.open()}});break;case"/BinCodeSHSet":i.read("/BinCodeSHSet",{urlParameters:{$filter:"WHSECD eq '"+this.getView().getModel("ui").getData().WHSECD+"'"},success:function(e,i){e.results.forEach(e=>{e.VHTitle=e.BINCD;e.VHDesc="";e.VHDesc2="";e.VHSelected=e.BINCD===a._inputValue});e.results.sort((e,t)=>e.VHTitle>t.VHTitle?1:-1);if(!a._valueHelpDialog){a._valueHelpDialog=sap.ui.xmlfragment("zuimhu.view.fragments.ValueHelpDialog",a).setProperty("title","Select BIN Code");a._valueHelpDialog.setModel(new t({items:e.results,title:"BIN Code"}));a.getView().addDependent(a._valueHelpDialog)}else{a._valueHelpDialog.setModel(new t({items:e.results,title:"BIN Code"}))}a._valueHelpDialog.open()}});break}},handleValueHelpClose:function(e){var t=this.getOwnerComponent().getModel();if(e.sId==="confirm"){var a=e.getParameter("selectedItem");var i=this;if(a){this._inputSource.setValue(a.getTitle());switch(this.dialogEntity){case"/PlantSHSet":this.getView().getModel("ui").setProperty("/PLANTCD",a.getTitle());break;case"/StorageLocSHSet":this.getView().getModel("ui").setProperty("/SLOC",a.getTitle());t.read("/StorageLocSHSet",{urlParameters:{$filter:"PLANTCD eq '"+this.getView().getModel("ui").getData().PLANTCD+"' and SLOC eq '"+a.getTitle()+"'"},success:function(e,t){i.getView().getModel("ui").setProperty("/STORAREACD",e.results[0].STORAREACD);i.getView().getModel("ui").setProperty("/WHSECD",e.results[0].WHSECD)}});break}}}},handleValueHelpSearch:function(e){var t=e.getParameter("value");var a=new sap.ui.model.Filter({filters:[new sap.ui.model.Filter("VHTitle",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("VHDesc",sap.ui.model.FilterOperator.Contains,t)],and:false});e.getSource().getBinding("items").filter([a])},onValueHelpLiveInputChange:function(e){if(this.validationErrors===undefined)this.validationErrors=[];var t=e.getSource();var a=!t.getSelectedKey()&&t.getValue().trim();t.setValueState(a?"Error":"None");if(!t.getSelectedKey()){t.getSuggestionItems().forEach(e=>{if(e.getProperty("key")===t.getValue().trim()){a=false;t.setValueState(a?"Error":"None")}})}this.addRemoveValueState(!a,t.getId());var i=t.getBindingInfo("value").binding.oContext.sPath;var s=t.getBindingInfo("value").parts[0].model;var l=t.getBindingInfo("value").parts[0].path;this.getView().getModel(s).setProperty(i+"/"+l,t.mProperties.selectedKey);this.getView().getModel(s).setProperty(i+"/EDITED",true)},onInputLiveChange:function(e){var t=e.getSource();var a=t.getBindingInfo("value").binding.oContext.sPath;var i=t.getBindingInfo("value").parts[0].model;this.getView().getModel(i).setProperty(a+"/EDITED",true)},addRemoveValueState(e,t){if(!e){if(!this._aInvalidValueState.includes(t)){this._aInvalidValueState.push(t)}}else{if(this._aInvalidValueState.includes(t)){for(var a=this._aInvalidValueState.length-1;a>=0;a--){if(this._aInvalidValueState[a]==t){this._aInvalidValueState.splice(a,1)}}}}},setButton(e){switch(e){case"EDIT":case"NEW":this.mode="EDIT";this.byId("smartFilterBar").setVisible(false);this.byId("detailsTab").setVisible(false);this.byId("btnSaveMain").setVisible(true);this.byId("btnCancelMain").setVisible(true);this.byId("searchFieldMain").setVisible(false);this.byId("btnNewMain").setVisible(false);this.byId("btnEditMain").setVisible(false);this.byId("btnPurgeMain").setVisible(false);this.byId("btnSetStatus").setVisible(false);this.byId("btnRefreshMain").setVisible(false);this.byId("btnExportExcel").setVisible(false);this.byId("btnSaveLayout").setVisible(false);break;case"LOAD":case"CANCEL":this.mode="READ";this.byId("btnSaveMain").setVisible(false);this.byId("btnCancelMain").setVisible(false);this.byId("searchFieldMain").setVisible(true);this.byId("btnNewMain").setVisible(true);this.byId("btnEditMain").setVisible(true);this.byId("btnPurgeMain").setVisible(true);this.byId("btnSetStatus").setVisible(true);this.byId("btnRefreshMain").setVisible(true);this.byId("btnExportExcel").setVisible(true);this.byId("btnSaveLayout").setVisible(true);this.byId("btnNewMain").setEnabled(true);this.byId("btnEditMain").setEnabled(true);this.byId("btnPurgeMain").setEnabled(true);this.byId("btnSetStatus").setEnabled(true);this.byId("btnRefreshMain").setEnabled(true);this.byId("btnExportExcel").setEnabled(true);this.byId("btnSaveLayout").setEnabled(true);this.byId("btnRefreshDtls").setEnabled(true);this.byId("smartFilterBar").setVisible(true);this.byId("detailsTab").setVisible(true);break;case"INIT":this.mode="INIT";this.byId("btnSaveMain").setVisible(false);this.byId("btnCancelMain").setVisible(false);this.byId("searchFieldMain").setVisible(true);this.byId("btnNewMain").setEnabled(false);this.byId("btnEditMain").setEnabled(false);this.byId("btnPurgeMain").setEnabled(false);this.byId("btnSetStatus").setEnabled(false);this.byId("btnRefreshMain").setEnabled(false);this.byId("btnExportExcel").setEnabled(false);this.byId("btnSaveLayout").setEnabled(false);this.byId("btnRefreshDtls").setEnabled(false);break;default:}},showLoadingDialog(e){if(!this._LoadingDialog){this._LoadingDialog=sap.ui.xmlfragment("zuimhu.view.fragments.LoadingDialog",this);this.getView().addDependent(this._LoadingDialog)}this._LoadingDialog.setTitle(e);this._LoadingDialog.open()},closeLoadingDialog(){this._LoadingDialog.close()}})});
},
	"zuimhu/i18n/i18n.properties":'# This is the resource bundle for zuimhu\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Manage Handling Units\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Manage Handling Units',
	"zuimhu/manifest.json":'{"_version":"1.17.0","sap.app":{"id":"zuimhu","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.8.6","toolsId":"ae996a7e-5078-4993-8c9d-e9b47ba46c87"},"dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZGW_3DERP_MHU_SRV/","type":"OData","settings":{"annotations":[],"localUri":"localService/mainService/metadata.xml","odataVersion":"2.0"}},"ZGW_3DERP_COMMON_SRV":{"uri":"/sap/opu/odata/sap/ZGW_3DERP_COMMON_SRV","type":"OData","settings":{"odataVersion":"2.0","annotations":[],"localUri":"localService/ZGW_3DERP_COMMON_SRV/metadata.xml"}},"ZVB_3DERP_MHU_FILTERS_CDS_Annotation":{"uri":"/destinations/LTD888/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Annotations(TechnicalName=\'ZVB_3DERP_MHU_FILTERS_CDS_VAN\',Version=\'0001\')/$value/","type":"ODataAnnotation","settings":{"localUri":"localService/ZVB_3DERP_MHU_FILTERS_CDS/ZVB_3DERP_MHU_FILTERS_CDS_Annotation.xml"}},"ZVB_3DERP_MHU_FILTERS_CDS":{"uri":"/sap/opu/odata/sap/ZVB_3DERP_MHU_FILTERS_CDS/","type":"OData","settings":{"odataVersion":"2.0","annotations":["ZVB_3DERP_MHU_FILTERS_CDS_Annotation"],"localUri":"localService/ZVB_3DERP_MHU_FILTERS_CDS/metadata.xml"}},"ZGW_3DERP_RFC_SRV":{"uri":"/sap/opu/odata/sap/ZGW_3DERP_RFC_SRV/","type":"OData","settings":{"odataVersion":"2.0","annotations":[],"localUri":"localService/ZGW_3DERP_RFC_SRV/metadata.xml"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.71.49","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"zuimhu.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{}},"ZGW_3DERP_COMMON_SRV":{"dataSource":"ZGW_3DERP_COMMON_SRV","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":false}},"ZVB_3DERP_MHU_FILTERS_CDS":{"dataSource":"ZVB_3DERP_MHU_FILTERS_CDS","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":false}},"ZGW_3DERP_RFC_SRV":{"dataSource":"ZGW_3DERP_RFC_SRV","preload":true,"settings":{"defaultBindingMode":"TwoWay","defaultCountMode":"Inline","refreshAfterChange":false}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"zuimhu.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"Routemain","pattern":":?query:","target":["Targetmain"]}],"targets":{"Targetmain":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"main","viewName":"main"}}},"rootView":{"viewName":"zuimhu.view.App","type":"XML","async":true,"id":"App"},"config":{"fullWidth":true}}}',
	"zuimhu/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"zuimhu/utils/locate-reuse-libs.js":'(function(e){var t=function(e,t){var n=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];Object.keys(e).forEach(function(e){if(!n.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t};var n=function(e){var n="";if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=t(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=t(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=t(e["sap.ui5"].componentUsages,n)}}return n};var r=function(e){var t=e;return new Promise(function(r,a){$.ajax(t).done(function(e){r(n(e))}).fail(function(){a(new Error("Could not fetch manifest at \'"+e))})})};var a=function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}};e.registerComponentDependencyPaths=function(e){return r(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(a)}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=document.getElementById("locate-reuse-libs");if(!currentScript){currentScript=document.currentScript}var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");var bundleResources=function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")};sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(bundleResources);if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(bundleResources)}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);',
	"zuimhu/view/App.view.xml":'<mvc:View controllerName="zuimhu.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"zuimhu/view/fragments/LoadingDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"><BusyDialog showCancelButton="false" close="onCloseLoadingDialog" /></core:FragmentDefinition>\n',
	"zuimhu/view/fragments/ValueHelpDialog.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog\n        id="valueHelpSelectDialog"\n\t\tclass="sapUiPopupWithPadding"\n        items="{\n            path: \'/items\',\n            sorter: {\n                path: \'VHTitle\'\n            }\n        }"\n        growing="true"\n        title="Select {/title}"\n        noDataText="No Records Found"\n        showClearButton="true"\n\t\tsearch="handleValueHelpSearch"\n\t\tconfirm="handleValueHelpClose"\n\t\tcancel="handleValueHelpClose"><StandardListItem\n            selected="{VHSelected}"\n\t\t\ttitle="{VHTitle}"\n\t\t\tdescription="{VHDesc}" \n            type="Active" /></SelectDialog></core:FragmentDefinition>',
	"zuimhu/view/main.view.xml":'<mvc:View\n    controllerName="zuimhu.controller.main"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:core="sap.ui.core"\n    xmlns:uiL="sap.ui.layout"\n    xmlns:uiT="sap.ui.table"\n    xmlns="sap.m"\n    xmlns:f="sap.f"\n    xmlns:semantic="sap.m.semantic"\n    xmlns:smartfilterbar="sap.ui.comp.smartfilterbar"\n    xmlns:cards="sap.f.cards"\n    xmlns:smartTable="sap.ui.comp.smarttable"\n    xmlns:sv="sap.ui.comp.smartvariants"\n    xmlns:layout="sap.ui.layout"\n    xmlns:t="sap.ui.table"\n    xmlns:plugins="sap.ui.table.plugins"\n    xmlns:fb="sap.ui.comp.filterbar"\n    displayBlock="true"\n><Page id="page" title="{i18n>title}" showHeader="false"><content><VBox fitContainer="true"><smartfilterbar:SmartFilterBar id="smartFilterBar" entitySet="ZVB_3DERP_MHU_FILTERS" search="onSearch" persistencyKey="3DERP_StylesPKey" showClearOnFB="true" filterContainerWidth="15rem"><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="SBU" groupId="_BASIC" label="SBU" mandatory="mandatory" width="50px"><smartfilterbar:customControl><ComboBox id="cboxSBU"\n                                    selectedKey="{ui>/sbu}"\n                                    items="{\n                                        path: \'/ZVB_3DERP_SBU_SH\'\n                                    }"><core:Item key="{SBU}" text="{SBU}" /></ComboBox></smartfilterbar:customControl></smartfilterbar:ControlConfiguration></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="HUTYP" label="HU Type" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="WHSECD" label="Warehouse" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="STORAREACD" label="Storage Area" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="PLANTCD" label="Plant" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="SLOC" label="Sloc" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="BINCD" label="Bin" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:controlConfiguration><smartfilterbar:ControlConfiguration key="EBELN" label="PO Number" groupId="_BASIC" preventInitialDataFetchInValueHelpDialog="false" /></smartfilterbar:controlConfiguration><smartfilterbar:layoutData><FlexItemData growFactor="0"/></smartfilterbar:layoutData></smartfilterbar:SmartFilterBar><uiT:Table id="mainTab" class="sapUiTinyMarginBottom sapUiTinyMarginBegin sapUiTinyMarginEnd" visibleRowCountMode="Auto" showColumnVisibilityMenu="true" rows="{MHU>/results}" enableColumnFreeze="true" selectionMode="MultiToggle" cellClick="onCellClickHdr" sort="onSorted" rowSelectionChange="onRowSelect" ><uiT:extension><Toolbar><ToolbarSpacer /><SearchField id="searchFieldMain" placeholder="Search" value="" search=".onSearchHeader" width="15rem" /><ToolbarSeparator /><Button id="btnSaveMain" icon="sap-icon://save" press=".onSaveHdr" visible="false" /><Button id="btnCancelMain" icon="sap-icon://sys-cancel" press=".onCancelHdr" visible="false" /><Button id="btnNewMain" icon="sap-icon://add" press=".onNewHdr" visible="true" /><Button id="btnEditMain" icon="sap-icon://edit" press=".onEditHdr" visible="true" /><Button id="btnPurgeMain" icon="sap-icon://delete" press=".onPurgeHdr" visible="true" /><Button id="btnSetStatus" icon="sap-icon://settings" press=".onSetStatus" visible="true" /><Button id="btnRefreshMain" icon="sap-icon://refresh" press=".onRefreshMain" visible="true" /><Button id="btnExportExcel" icon="sap-icon://download" press=".onExportExcel" visible="true" /><Button id="btnSaveLayout" icon="sap-icon://grid" press=".onSaveLayout" visible="true" /></Toolbar></uiT:extension><uiT:layoutData><FlexItemData growFactor="1" baseSize="0%" /></uiT:layoutData></uiT:Table><uiT:Table id="detailsTab" class="sapUiTinyMarginBottom sapUiTinyMarginBegin sapUiTinyMarginEnd" visibleRowCountMode="Auto" showColumnVisibilityMenu="true" rows="{MHUDTLS>/results}" enableColumnFreeze="true" selectionMode="MultiToggle" cellClick="onCellClickDtls" sort="onSorted"><uiT:extension><Toolbar><Text id="txtHUID" text="Internal HU ID: {ui>/HUID}" class="selHdrKeyFontStyle" /><ToolbarSpacer /><SearchField id="searchFieldDtls" placeholder="Search" value="" search="filterGlobally" width="15rem" /><ToolbarSeparator /><Button id="btnRefreshDtls" icon="sap-icon://refresh" press=".onRefreshDtls" visible="true" /></Toolbar></uiT:extension><uiT:layoutData><FlexItemData growFactor="1" baseSize="0%" /></uiT:layoutData></uiT:Table></VBox></content></Page></mvc:View>\n'
}});