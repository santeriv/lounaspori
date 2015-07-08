/* 
	jQuery Mobile Boilerplate
	application.js
*/

var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var isofied_date_string = year+'-'+month+'-'+day;/* == (ISO_8601 - leading zeros in date - time stamp - time zone)*/ 

$(document).on("pageinit", function(event) {
    // custom code goes here
});

$(document).on("pagebeforechange", function(event) {
	if(event.target.baseURI.indexOf('martat.html') !== -1) {
	    /*martat*/
	    start_martat_load();
	}
	if(event.target.baseURI.indexOf('cafesolo.html') !== -1) {
	    /*cafe solo*/
	    start_cafesolo_load();
	}
	if(event.target.baseURI.indexOf('wanhajuhana.html') !== -1) {
	    /*wanha juhana*/
	    start_wanhajuhana_load();
	}
	if(event.target.baseURI.indexOf('sofia.html') !== -1) {
	    /*ravintola sofia*/
	    start_sofia_load();
	}
	if(event.target.baseURI.indexOf('saikku.html') !== -1) {
	    /*saikku kanttiini*/
	   start_saikku_load();
	}
	if(event.target.baseURI.indexOf('hhcafe.html') !== -1) {
	    /*hh cafe*/
	    start_hhcafe_load();
	}
});

function start_hhcafe_load(){
	var site = "http://www.hhnet.fi/HHnet.aspx?id=130&p1=130&p2=130&hhcafe=66";
	var jqueryselector = 'find("div[id=\'ContentPlaceHolderMainDiv_LunchList1_MenuPanel\'] table tr td")';
	var datahandler = function(data) {
		var valuecondition = function(value) {
			return value.SPAN && value.SPAN.text || undefined;
		};
		var maxmealrows = 7;
		var dateregex = /^(MA$|Maanantai|TI$|Tiistai|KE$|Keskiviikko|TO$|Torstai|PE$|Perjantai)/gi;
		var weekmenu = parselunchdata(data,valuecondition,dateregex,maxmealrows);
		var cssListSelector = "#hhcafe";
		refreshlunchlist(weekmenu,cssListSelector);
	};
	jqueryp(site,jqueryselector,datahandler);
}

function start_saikku_load(){
	var site = "http://opiskelijatalo.fi/kanttiini/";
	var jqueryselector = 'find("table.lounaslista tr td")';
	var datahandler = function(data) {
		var valuecondition = function(value) {
			return value.text || undefined;
		};
		var dateregex = /^(MA$|Maanantai|TI$|Tiistai|KE$|Keskiviikko|TO$|Torstai|PE$|Perjantai)/gi;
		var weekmenu = parselunchdata(data,valuecondition,dateregex);
		var cssListSelector = "#saikku";
		refreshlunchlist(weekmenu,cssListSelector);
	};
	jqueryp(site,jqueryselector,datahandler);
}

function start_sofia_load(){
	var api_site = "http://www.amica.fi/api/restaurant/menu/week?language=fi&restaurantPageId=8436&weekDate="+isofied_date_string;
	var datahandler = function(data) {
		var cssListSelector = "#sofia";
		var menulisttemplatesource = 
			    "{{#each LunchMenus}}"+
			    "<li>{{this.Date}}\n"+
			    "	<br />\n"+
				"{{#each this.SetMenus}}"+
				"		\t\t{{this.Name}} - {{this.Price}}<br />\n"+
					"{{#each this.Meals}}"+
					"		\t\t{{this.Name}} - {{this.Diets}}<br />\n"+
					"{{/each}}"+
				"{{/each}}"+
			    "</li>\n"+
			    "{{/each}}";
		var menulisttemplate = Handlebars.compile(menulisttemplatesource);
		var menulist = menulisttemplate(data);
		/*console.log("menulist content=",menulist);*/
		$(cssListSelector).append(menulist);
		$(cssListSelector).listview('refresh');

	};
	$.ajax({
		dataType: 'jsonp',
		url: site,
		success: successhandler
	});
}

function start_wanhajuhana_load(){
	var site = "http://www.wanhajuhana.fi/index2.php";
	var jqueryselector = 'find("table[id=\'etu\'] td")';
	var datahandler = function(data) {
		var valuecondition = function(value) {
			return value.text || (value.EM && value.EM.text) || undefined;
		};
		var dateregex = /^(MA|Maanantai|TI|Tiistai|KE|Keskiviikko|TO|Torstai|PE|Perjantai)/gi;
		var weekmenu = parselunchdata(data,valuecondition,dateregex);
		var cssListSelector = "#wanhajuhana";
		refreshlunchlist(weekmenu,cssListSelector);
	};
	jqueryp(site,jqueryselector,datahandler,false/*true,see TODO below*/);
}

function start_cafesolo_load(){
	var site = "http://www.cafesolo.fi/";
	var jqueryselector = "find('.region-sidebar-second li')";
	var datahandler = function(data) {
		var valuecondition = function(value) {
			return value.text || (value.EM && value.EM.text) || undefined;
		};
		var dateregex = /^(MA|\n\t\tMa|Maanantai|TI|\n\t\tTI|Tiistai|KE|\n\t\tKE|Keskiviikko|TO|\n\t\tTO|Torstai|PE|\n\t\tPE|Perjantai)/gi;
		var weekmenu = parselunchdata(data,valuecondition,dateregex);
		var cssListSelector = "#cafesolo";
		refreshlunchlist(weekmenu,cssListSelector);
	};
	jqueryp(site,jqueryselector,datahandler);
}

function start_martat_load(){
	var site = "http://www.martat.fi/piirit/satakunta/lounaslista/";
	var jqueryselector = "find('strong')";
	var datahandler = function(data) {
		var valuecondition = function(value) {
			return value.text || (value.EM && value.EM.text) || undefined;
		};
		var dateregex = /^(MA|Maanantai|TI|Tiistai|KE|Keskiviikko|TO|Torstai|PE|Perjantai).\d?\d.\d?\d./gi;
		var weekmenu = parselunchdata(data,valuecondition,dateregex);
		var cssListSelector = "#martat";
		refreshlunchlist(weekmenu,cssListSelector);
	};
	jqueryp(site,jqueryselector,datahandler);
}

/***
 * sites that use jsonp.afeld.me 
 *
 ***/
function jsonp_call(site,successhandler) {
   $.ajax({
	dataType: 'jsonp',
	url: "https://jsonp.afeld.me/?url="+site,
	success: successhandler
  });
}
/***
 * sites that use pulljson.com
 *
 ***/
function jqueryp(site,jqueryselector,successhandler,forceText) {
	var forceTextParam = forceText || false;
	/*TODO: implement forceText data handling support*/
	$.ajax({
		dataType: 'jsonp',
		url: "http://pulljson.com/jquery?site="+site+"&selector="+jqueryselector+"&forceText="+forceTextParam,
		success: successhandler
	});
}

/***
 * 
 *
 ***/
function refreshlunchlist(weekmenulistresult,listCSSselector) {
	/*create handlebars template for list of items*/
	/*"weekmenu":[
		{"date":"Ma 15.5",
		"menu":["Papusoppa","Potut ja pihvi","Pannari"]
		},
		{"date":"Ti 16.5",
		"menu":["Hernari"]
		}
	]*/
	var menulisttemplatesource = 
		    "{{#each weekmenu}}"+
		    "<li>{{this.date}}\n"+
		    "	<br />\n"+
				"{{#each this.menu}}"+
		    "		\t\t{{this}}<br />\n"+
				"{{/each}}"+
		    "</li>\n"+
		    "{{/each}}";
	var menulisttemplate = Handlebars.compile(menulisttemplatesource);
	var menulist = menulisttemplate(weekmenulistresult);
	/*console.log("menulist content=",menulist);*/
	$(listCSSselector).append(menulist);
	$(listCSSselector).listview('refresh');
}

/***
 *
 *
 ***/
function parselunchdata(data,valuecondition,dateregex, maxrowsperday) {
	var result = {};
	var maxrowsperday = maxrowsperday || 4;
	var weekmenu = [];
	var daymenu;
	var menu = new Array();
    
    /* test of changing data before looping it
    var filteredresults = _(data.results).chain()
		.pluck("EM").reject(_.isUndefined)
		.pluck("text").reject(_.isUndefined).value();
	data.results = _.extend( data.results, filteredresults);
    console.log('flattenedresults=',filteredresults);
    */
    $.each(data.results, function(key, val) {
    	var textvalue = valuecondition(val);
        if(textvalue !== undefined) {
			/*check if text matches with Date*/
        	var date = textvalue.match(dateregex);
        	if(date !== null) 
        	{
                if(weekmenu !== null && daymenu !== undefined){
            		/*push in daymenu*/
            		weekmenu.push(daymenu);
            	}                		
        		/*empty daymenu, and prepare new one*/
            	menu = new Array();
            	daymenu = {};
            	var menuitem = textvalue.split(date)[1];
            	daymenu["date"]=date;
            	menuitem = menuitem.trim();
            	menu.push(menuitem);
            	daymenu["menu"]=menu;
        	}
        	else if(!_.isEmpty(daymenu) && _.size(daymenu.menu) < maxrowsperday) {
            	/*add another meal for date*/
            	var menuitem = textvalue;
            	menuitem = menuitem.trim();
            	menu.push(menuitem);
            	daymenu["menu"]=menu;
        	}
        }
    });
    /*console.log('weekmenu=',weekmenu);*/
   	if(weekmenu !== undefined) {
   		/*clean last daymenu empty items*/
   		if(daymenu !== undefined) {
   			daymenu.menu = _.filter(daymenu.menu, function(menuitem){ return !_.isEmpty(menuitem); });
   		}
   		/*push in last daymenu*/
   		weekmenu.push(daymenu);
   		/*put all togehter*/
   		result["weekmenu"]=weekmenu;
   	}
   	/*console.log("result",result);*/
   	return result;
}
