var firefox = require('selenium-webdriver/firefox'),
	chrome = require('selenium-webdriver/chrome'),
	By = require('selenium-webdriver').By;

var driver = undefined;
var promise = undefined;
var eleInfo = {};

////////////////////////////////////////////////////////////
/////               ドライバーの起動・終了                /////
////////////////////////////////////////////////////////////

// FirefoxのWeb Driverを起動する
function startFirefoxDriver(){
	if(driver !== undefined){return}
	driver = new firefox.Driver();
}

// chromeのWeb Driverを起動する	
function startChromeDriver(){
	if(driver !== undefined){return}
	driver = new chrome.Driver();
}

// Web Driverを終了させる
function stopDriver(){
	if(driver === undefined){return} // driverが起動してなかったら何もしない
	toggleProcessing();
	driver.quit()
		// quit()処理が終わった後、driverにundefinedを設定する
		.then(function(){
			driver = undefined;
			toggleProcessing();
		});
}
////////////////////////////////////////////////////////////
/////               URLを開く                /////
////////////////////////////////////////////////////////////

// 指定したURLを開く
function openUrl(event){
  if(driver === undefined){return} // driverが起動してなかったら何もしない
  driver.get(event.data.url);
}

////////////////////////////////////////////////////////////
/////               エレメントを指定して◯◯                /////
////////////////////////////////////////////////////////////

// 指定したエレメントを探す
// 取得したエレメントはpromiseに保存しておいて、
// それを後から色々いじれるようにしておく
function findElements(){
	if(driver === undefined){return} // driverが起動してなかったら何もしない
	switch ( $("#elementBy").text() ){
		case "id " :
			elementBy = By.id($("#elementName").val());
			break;
		case "name " :
			elementBy = By.name($("#elementName").val());
			break;
		case "XPath " :
			elementBy = By.xpath($("#elementName").val());
			break;
		case "CSS Selector " :
			elementBy = By.css($("#elementName").val());
	}
	toggleProcessing();
	promise = driver.findElements(elementBy)
		.then(function(elements){
			$("#eleNum").text(elements.length); // 見つかったエレメントの数を表示。全部表示すると大変なので
			// エレメント情報をリセット
			$("#eleInfoView").text("ここに情報が表示されます");
			eleInfo = {};
			toggleProcessing();
			return elements; // 自分を返してあげないと、promiseにundefinedが入ってしまう。
		},err);
}

function getEleInfo(){
	if(promise === undefined || $("#eleNum").text === "0" ){return} // findElementできてなかったら何もしない
	// エレメント情報表示部の更新
	var updateEleInfoView = function(){$("#eleInfoView").text(JSON.stringify(eleInfo))};
	toggleProcessing();
	promise.then(function(e){
		switch ( $("#eleInfo").text() ){
			case "tagName " :
				e[0].getTagName()
				  .then(function(tagName){
				  	eleInfo.tagName = tagName;
				  	toggleProcessing();
			  	})
			  	.then(updateEleInfoView);
			  break;
			case "text " :
				e[0].getText()
					.then(function(text){
						eleInfo.text = text;
						toggleProcessing();
					})
					.then(updateEleInfoView);
				break;
			case "size ":
			  e[0].getSize()
			    .then(function(size){
			    	eleInfo.width = size.width;
			    	eleInfo.height = size.height;
			    	toggleProcessing();
			    })
			    .then(updateEleInfoView);
			   break;
			 case "location ":
			 	e[0].getLocation()
			 		.then(function(location){
			 			eleInfo.x = location.x;
			 			eleInfo.y = location.y;
			 			toggleProcessing();
			 		})
			 		.then(updateEleInfoView);
			 	break;
		}
	});
}

////////////////////////////////////////////////////////////
/////               画面系処理                /////
////////////////////////////////////////////////////////////
function toggleDropdown(event){
	event.data.target.html(this.text+" <span class='caret'></span>");
}

function toggleProcessing(){
	$("#hide").toggleClass("displayNone");
	$("#loader").toggleClass("displayNone");
	$("#hide").toggleClass("displayBlock");
	$("#loader").toggleClass("displayBlock");
}

////////////////////////////////////////////////////////////
/////               util                /////
////////////////////////////////////////////////////////////
var err = function(err_message){
	console.log(err_message);
}

////////////////////////////////////////////////////////////
/////               イベントのバインド                /////
////////////////////////////////////////////////////////////
$(document).ready(function(){
	$("#drive-firefox").bind("click", startFirefoxDriver);
	$("#drive-chrome").bind("click", startChromeDriver);
	$("#quit-drive").bind("click", stopDriver);
	
	$("#openUrl").bind("click", {url: $("#openUrlAddress").val()} , openUrl);

	$(".toggle-elementBy").bind("click", {target: $("#elementBy")}, toggleDropdown);
	$("#findElements").bind("click", findElements);

	$(".toggle-getEleInfo").bind("click", {target: $("#eleInfo")}, toggleDropdown);
	$("#getEleInfo").bind("click", getEleInfo);
});

// mac でネイティブコマンド使うためのコード(Ctrl+AとかCtrl+Cとか)
var gui = require('nw.gui');
var win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
	nativeMenuBar.createMacBuiltin("selenium-learn");
	win.menu = nativeMenuBar;
} catch (ex) {
	console.log(ex.message);
}
