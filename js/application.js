/* 
	jQuery Mobile Boilerplate
	application.js
*/
var martatdone=false;
$(document).on("pageinit", function(event) {
    // custom code goes here
});

$(document).on("pagebeforechange", function(event) {
	if(event.target.baseURI.indexOf('lists.html') !== -1) {
	    /*martat*/
	    start_martat_load();
	}
});

function start_martat_load(){
	if(martatdone === false){
		$.ajax({
		        dataType: 'jsonp',
		        url: "http://pulljson.com/jquery?site=http://www.martat.fi/piirit/satakunta/lounaslista/&selector=find('strong')",
		        success: martat
		    });
	}
	martatdone=true;
}
    
function martat(data) {
			var result = {};
            var weekmenu = [];
            var daymenu;
            var menu = new Array();
            $.each(data.results, function(key, val) {
                if(val.text !== undefined) {
					/*check if text matches with Date*/
					var regex = /(MA|Maanantai|TI|Tiistai|KE|Keskiviikko|TO|Torstai|PE|Perjantai).\d?\d.\d?\d./gi;
                	var date = val.text.match(regex);
                	if(date !== null) 
                	{
		                if(weekmenu !== null && daymenu !== undefined){
	                		/*push in daymenu*/
	                		weekmenu.push(daymenu);
	                	}                		
                		/*empty daymenu, and prepare new one*/
	                	menu = new Array();
	                	daymenu = {};
	                	var menuitem = val.text.split(date)[1];
	                	daymenu["date"]=date;
	                	menuitem = menuitem.trim();
	                	menu.push(menuitem);
	                	daymenu["menu"]=menu;
                	}
                	else if(!_.isEmpty(daymenu) && _.size(daymenu.menu) < 4/*max four rows per day*/) {
	                	/*add another meal for date*/
	                	var menuitem = val.text;
	                	menuitem = menuitem.trim();
	                	menu.push(menuitem);
	                	daymenu["menu"]=menu;
	            	}
                }
   		});
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
		    "	<ul>\n"+
				"{{#each this.menu}}"+
		    "		<li>{{this}}</li>\n"+
				"{{/each}}"+
		    "	</ul>\n"+
		    "</li>\n"+
		    "{{/each}}";
		var martattemplate = Handlebars.compile(martattemplatesource);
		var martatlist = martattemplate(result);
	    /*console.log("martat content=",martatlist);*/
        $('#martat').append(martatlist);
        $('#martat').listview('refresh');
}