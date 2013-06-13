/* 
	jQuery Mobile Boilerplate
	application.js
*/
var martatdone=false;
var cafesolodone=false;
$(document).on("pageinit", function(event) {
    // custom code goes here
});

$(document).on("pagebeforechange", function(event) {
	if(event.target.baseURI.indexOf('lists.html') !== -1) {
	    /*martat*/
	    start_martat_load();
	    /*cafe solo*/
	    setTimeout("start_cafesolo_load()",10000);
	}
});



function start_martat_load(nextcall){
	if(martatdone === false){
		$.ajax({
		        dataType: 'jsonp',
		        url: "http://pulljson.com/jquery?site=http://www.martat.fi/piirit/satakunta/lounaslista/&selector=find('strong')",
		        success: martat
		    });
	}
	martatdone=true;
}

function start_cafesolo_load(){
	if(cafesolodone === false){
		$.ajax({
		        dataType: 'jsonp',
		        url: "http://pulljson.com/jquery?site=http://www.cafesolo.fi/&selector=find('div.region-lounas li')",
		        success: cafesolo
		    });
	}
	cafesolodone=true;
}

function cafesolo(data) {
            var valuecondition = function(value) {return value.text || (value.EM && value.EM.text) || undefined};

			var result = {};
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
					var regex = /^(MA|Maanantai|TI|Tiistai|KE|Keskiviikko|TO|Torstai|PE|Perjantai)/gi;
                	var date = textvalue.match(regex);
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
                	else if(!_.isEmpty(daymenu) && _.size(daymenu.menu) < 4/*max four rows per day*/) {
	                	/*add another meal for date*/
	                	var menuitem = textvalue;
	                	menuitem = menuitem.trim();
	                	menu.push(menuitem);
	                	daymenu["menu"]=menu;
	            	}
                }
   		});
   		/*console.log('weekmenu=',weekmenu);*/
   		if(weekmenu !== undefined){
   			/*clean last daymenu empty items*/
   			daymenu.menu = _.filter(daymenu.menu, function(menuitem){ return !_.isEmpty(menuitem); });
	    	/*push in last daymenu*/
	        weekmenu.push(daymenu);
	        /*put all togehter*/
	        result["weekmenu"]=weekmenu;
	    }
	    var martattemplatesource = 
		    "{{#each weekmenu}}"+
		    "<li>{{this.date}}\n"+
		    "	<br />\n"+
				"{{#each this.menu}}"+
		    "		\t\t{{this}}<br />\n"+
				"{{/each}}"+
		    "</li>\n"+
		    "{{/each}}";
		var martattemplate = Handlebars.compile(martattemplatesource);
		var martatlist = martattemplate(result);
        $('#cafesolo').append(martatlist);
        $('#cafesolo').listview('refresh');
}
    
function martat(data) {
            var valuecondition = function(value) {return value.text || (value.EM && value.EM.text) || undefined};

			var result = {};
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
					var regex = /^(MA|Maanantai|TI|Tiistai|KE|Keskiviikko|TO|Torstai|PE|Perjantai).\d?\d.\d?\d./gi;
                	var date = textvalue.match(regex);
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
                	else if(!_.isEmpty(daymenu) && _.size(daymenu.menu) < 4/*max four rows per day*/) {
	                	/*add another meal for date*/
	                	var menuitem = textvalue;
	                	menuitem = menuitem.trim();
	                	menu.push(menuitem);
	                	daymenu["menu"]=menu;
	            	}
                }
   		});
   		/*console.log('weekmenu=',weekmenu);*/
   		if(weekmenu !== undefined){
   			/*clean last daymenu empty items*/
   			daymenu.menu = _.filter(daymenu.menu, function(menuitem){ return !_.isEmpty(menuitem); });
	    	/*push in last daymenu*/
	        weekmenu.push(daymenu);
	        /*put all togehter*/
	        result["weekmenu"]=weekmenu;
	    }
	    /*console.log("result",result);*/
	    
	    /*create handlebars template for list of items*/
	    /*"weekmenu":[
	    		{"date":"Ma 15.5",
	    		"menu":["Papusoppa","Potut ja pihvi","Pannari"]
	    		},
	    		{"date":"Ti 16.5",
	    		"menu":["Hernari"]
	    		}
	    ]*/
	    var martattemplatesource = 
		    "{{#each weekmenu}}"+
		    "<li>{{this.date}}\n"+
		    "	<br />\n"+
				"{{#each this.menu}}"+
		    "		\t\t{{this}}<br />\n"+
				"{{/each}}"+
		    "</li>\n"+
		    "{{/each}}";
		var martattemplate = Handlebars.compile(martattemplatesource);
		var martatlist = martattemplate(result);
	    /*console.log("martat content=",martatlist);*/
        $('#martat').append(martatlist);
        $('#martat').listview('refresh');
}