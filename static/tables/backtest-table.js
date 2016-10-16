import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {Button} from 'react-bootstrap';
import {BacktestControl, renderLog, pad} from '../../static/utils';

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
	"M+": this.getMonth() + 1, //月份
	"d+": this.getDate(), //日
	"h+": this.getHours(), //小时
	"m+": this.getMinutes(), //分
	"s+": this.getSeconds(), //秒
	"q+": Math.floor((this.getMonth() + 3) / 3), //季度
	"S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var BacktestTable = React.createClass({
    getInitialState() {
	return {
	    columnDefs: [],
	    rowData: [],
	    idList: new Set(),
	    defaultData: {}
	};
    },
    onGridReady(params) {
	this.api = params.api;
	this.columnApi = params.columnApi;
    },
    addRow() {
	var r = Object.assign({}, this.state.defaultData);
	var c = this.state.idList;
	var rows = this.state.rowData;
	var i = 0;
	var id = undefined;
	do {
	    i += 1;
	    id = r.strategy + "-backtest-" + pad(i, 5);
	} while (c.has(id));
	r['id'] = id;
	this.state.rowData.push(r);
	this.state.idList.add(id);
	this.api.setRowData(rows);
    },
    removeRow(props) {
	props.api.removeItems([props.node]);
	this.state.rowData.splice(props.rowIndex, 1);
	this.state.idList.delete(props.data.id);
    },
    componentWillReceiveProps(newprops) {
	var l = this;
	if (newprops.header != undefined) {
	    var d = newprops.header;
	    var start = [
		{headerName: "Id",
		 field: "id"},
		{headerName: "Instrument",
		 field: "dataname",
		 volatile: true,
		 editable: true,
		 defaultData: ''},
		{headerName: "Backtest file",
		 field: "tickersource",
		 volatile: true,
		 editable: true,
		 defaultData: 'ticker-%{instrument}.txt'},
		{headerName: "Jitter",
		 field: "jitter",
		 volatile: true,
		 editable: true,
		 defaultData: 0}
	    ];
	    var end = [
		{headerName: "Initial cash",
		 field: "initial_cash",
		 volatile: true,
		 editable: true,
		 defaultData: 100000.0},
		{headerName: "Backtest Start",
		 field: "backtest_start_time",
		 volatile: true,
		 editable: true},
		{headerName: "Backtest End",
		 field: "backtest_end_time",
		 volatile: true,
		 editable: true},
		{headerName: "Backtest",
		 field: "backtest",
		 volatile: true,
		 cellRendererFramework: BacktestControl,
		 parent: l
		}];
	    
	    for (var i=0; i < d.length; i++) {
		d[i]['editable'] = true;
		d[i]['volatile'] = true;
	    }
	    var items = start.concat(d).concat(end);
	    var defaultData = {};
	    for (var i=0; i < items.length; i++) {
		if (items[i].defaultData != undefined) {
		    defaultData[items[i].field] =
			items[i].defaultData;
		}
	    }
	    defaultData['strategy'] = l.props.strategy;
	    var d = new Date();
	    // Get previous monday
	    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
	    d.setHours(0);
	    d.setMinutes(0);
	    d.setSeconds(0);
	    d.setMilliseconds(0);
	    defaultData['backtest_start_time'] =
		d.Format("yyyy-MM-dd hh:mm:ss");
	    l.setState({columnDefs: items,
			defaultData: defaultData});   
	}
    },
    render() {
	return (
	    <div>
		<Button onClick={this.addRow}>New Backtest</Button>
	<AgGridReact
	    // column definitions and row data are immutable, the grid
	    // will update when these lists change
	    columnDefs={this.state.columnDefs}
	    rowData={this.state.rowData}
	    onGridReady={this.onGridReady}
		/></div>
	)
    }
});
    
module.exports.BacktestTable = BacktestTable;
