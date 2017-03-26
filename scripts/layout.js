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

// 导航栏
function highlightPage() {
  var navigation = document.getElementsByTagName("nav");
  var links = navigation[0].getElementsByTagName("a");
  var linkurl;
  for (var i=0; i<links.length; i++) {
    linkurl = links[i].getAttribute("href");
    if (window.location.href.indexOf(linkurl) != -1) {
      links[i].className = "here";
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
          // 获取<abstract><author><name>三部分内容
          var txt = "<b>Abstract:</b> " + article.getElementsByTagName("abstract")[0].firstChild.nodeValue; // txt获取abstract内容
          var photoSrc = article.getElementsByTagName("author")[0].firstChild.nodeValue; //获取photo链接
          var name = article.getElementsByTagName("name")[0].firstChild.nodeValue
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
          brDiv.innerHTML = "<br>";
          nameDiv.innerHTML = "<strong>"+name+"</strong><br>";
          photoAside.appendChild(imgDiv); // 将3个div加入photoAside中
          insertAfter(brDiv, imgDiv);
          insertAfter(nameDiv, brDiv);
          // abstract展示区域
          var txtBox = document.createElement("p"); // 创建abstract文本部分
          txtBox.className = "abstractDiv";
          txtBox.innerHTML = txt;
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