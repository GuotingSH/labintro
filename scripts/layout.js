// Global
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

function insertAfter(newElement,targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement,targetElement.nextSibling);
  }
}
//返回顶部
function pageScroll() {
  //获取scrollTop值
  var sTop = document.body.scrollTop || document.documentElement.scrollTop; 
  var pace = Math.max(1, sTop/10);
  window.scrollBy(0,-pace); 
  //延时递归调用，模拟滚动向上效果 
  scrolldelay = setTimeout('pageScroll()',20); 
  //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面） 
  if(sTop == 0) clearTimeout(scrolldelay); 
}

function actionUp() {
  var uptop = document.getElementById("totop");
  uptop.onclick = function() {
    return pageScroll();
  }
}

// 导航栏
function myFunction() {
  if (document.body.scrollTop > 68 || document.documentElement.scrollTop > 68) {
    document.getElementById("headtop").className = "fixhead";
    document.getElementById("headback").className = "headbackbig"
    document.getElementById("totop").className = "showtotop";
  } else {
    document.getElementById("headtop").className = "";
    document.getElementById("headback").className = "headback"
    document.getElementById("totop").className = "hidetotop";
  }
}

window.onscroll = function() {myFunction()};

function highlightPage() {
  var navigation = document.getElementsByTagName("nav");
  var links = navigation[0].getElementsByTagName("a");
  var linkurl;
  for (var i=0; i<links.length; i++) {
    linkurl = links[i].getAttribute("href");
    if (window.location.href.indexOf(linkurl) != -1) {
      links[i].parentNode.className = "here";
    }
  }
}

// Ajax 展示文章摘要
function getHTTPObject() {
  if (typeof XMLHttpRequest == "undefined")
    XMLHttpRequest = function () {
      try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
        catch (e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
        catch (e) {}
      try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) {}
      return false;
  }
  return new XMLHttpRequest();
}

function prepareAbstract() {
  if (!document.getElementById("showCase")) return false;
  var showCase = document.getElementById("showCase");
  var links = showCase.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = function() {
      return showAbstract(this) ? false : true;
    }
  }
}

function showAbstract(whichArticle) {
  if (whichArticle.parentNode.nextSibling.tagName === "DIV") {
    document.getElementById("showCase").removeChild(whichArticle.parentNode.nextSibling);
  } else {
    var request = getHTTPObject();
    if (request) {
      request.open("GET", "articlelist.xml", true);
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status ==200) {
          var xmlDoc = request.responseXML.documentElement;
          var articleList = xmlDoc.getElementsByTagName("article");
          var whichId = parseInt(whichArticle.getAttribute("id"));
          var lists = xmlDoc.getElementsByTagName("article");
          var article = lists[lists.length - whichId]; // 定位到点击的article
          // 获取<abstract><author><name><link><pdf>五部分内容
          var txt = "<b>Abstract:</b> " + article.getElementsByTagName("abstract")[0].firstChild.nodeValue; // txt获取abstract内容
          var photoSrc = article.getElementsByTagName("author")[0].firstChild.nodeValue; //获取photo链接
          var name = article.getElementsByTagName("name")[0].firstChild.nodeValue;
          var link = article.getElementsByTagName("link")[0].firstChild.nodeValue;
          var pdf = article.getElementsByTagName("pdf")[0].firstChild.nodeValue;
          // 搭建树状结构
          var abstractDiv = document.createElement("div"); // 创建abstract大框，包括照片和描述
          // 照片展示区域，结构与members页面相同
          var photoDiv = document.createElement("div"); // 创建照片展示div
          photoDiv.className = "person";
          var photoAside = document.createElement("aside"); //创建<aside>
          photoDiv.appendChild(photoAside); // 将<aside>加入photodiv
          var imgDiv = document.createElement("div");
          var photo = document.createElement("img");
          var brDiv = document.createElement("div");
          var nameDiv = document.createElement("div");
          photo.setAttribute("src", photoSrc); // 设置photo链接
          imgDiv.appendChild(photo); // 将photo加入imgDiv
          brDiv.innerHTML = "<br/>";
          nameDiv.innerHTML = "<strong>"+name+"</strong><br/>";
          photoAside.appendChild(imgDiv); // 将3个div加入photoAside中
          insertAfter(brDiv, imgDiv);
          insertAfter(nameDiv, brDiv);
          // abstract展示区域
          var txtBox = document.createElement("p"); // 创建abstract文本部分
          txtBox.className = "abstractDiv";
          var abstractTxt = txt + ' <a ' + link + 'target="_blank">[link]</a>' + ' <a ' + pdf + 'target="_blank">[pdf]</a>';
          txtBox.innerHTML = abstractTxt;
          abstractDiv.appendChild(photoDiv);
          insertAfter(txtBox, photoDiv);
          insertAfter(abstractDiv, whichArticle.parentNode);
        }
      }
    request.send(null);
    }
  }
  return true;
}

// article.html页面list隔行换色
function stripeLists() {
  if (!document.getElementById("showCase")) return false;
  var showCase = document.getElementById("showCase");
  var lists = showCase.getElementsByTagName("li");
  for (var i=0; i<lists.length; i++) {
    if (i%2 === 1) {
      lists[i].className = "odd";
    }
  }
}

addLoadEvent(stripeLists);
addLoadEvent(prepareAbstract);
addLoadEvent(highlightPage);
addLoadEvent(actionUp);