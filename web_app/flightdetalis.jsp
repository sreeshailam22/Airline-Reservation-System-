<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
String selSource = request.getParameter("s");
String selDest = request.getParameter("d");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Flight Details</title>
<center><img src="image/images.jpg" height='200' width='400' border=1 ></img></center>
<style>
ul
{
list-style-type:none; padding:0; overflow:hidden;
}

li{ float:left; }
a:link,a:visited
{
display:block;
width:250px;
font-weight:bold;
color:#ffffff;
background-color:#333300;
text-align:center;
padding:4px;
text-decoration:none;
text-transform:uppercase;
}
a:hover,a:active{ background-color:#00ff66;}
</style>
<script type="text/javascript">
var selectedSource = "<%= selSource != null ? selSource : "" %>";
var selectedDest = "<%= selDest != null ? selDest : "" %>";

function source()
{
	var sourceSelect = document.getElementById("s");
	sourceSelect.innerHTML = "";
	var xmlreq = new XMLHttpRequest();
	xmlreq.open("post","./SourceRetrieveServlet",true);
	xmlreq.send();
	xmlreq.onreadystatechange = function ()
	{
		if(xmlreq.status==200&&xmlreq.readyState==4)
		{
			var option = document.createElement("option");
			option.text = "select";
			option.value = "select";
			sourceSelect.add(option);
			
			var res = eval("("+xmlreq.responseText+")");
			var country = res.source;
			
			for(var i=0;i<country.length;i++)
			{
				var option = document.createElement("option");
				option.text = country[i].sname;
				option.value = country[i].sid;
				if (country[i].sid === selectedSource) {
					option.selected = true;
				}
				sourceSelect.add(option);
			}
			
			if (selectedSource) {
				dest();
			}
		}
	}
}

function dest()
{
	var si = document.getElementById("s").value;
	var destSelect = document.getElementById("d");
	destSelect.innerHTML = "";
	if (si === "select" || !si) {
		var option = document.createElement("option");
		option.text = "select";
		option.value = "select";
		destSelect.add(option);
		return;
	}
	var xmlreq = new XMLHttpRequest();
	xmlreq.open("post","./DestinationRetrieveServlet?s="+si+"",true);
	xmlreq.send();
	xmlreq.onreadystatechange = function ()
	{
		if(xmlreq.status==200&&xmlreq.readyState==4)
		{
			var option = document.createElement("option");
			option.text = "select";
			option.value = "select";
			destSelect.add(option);
			
			var res = eval("("+xmlreq.responseText+")");
			var country = res.destination;
			
			for(var i=0;i<country.length;i++)
			{
				var option = document.createElement("option");
				option.text = country[i].dname;
				option.value = country[i].did;
				if (country[i].did === selectedDest) {
					option.selected = true;
				}
				destSelect.add(option);
			}
		}
	}
}
</script>
</head>

<body bgcolor='#669999' onload="source();">
<center>
<form action="viewflights.jsp" method="post">
<ul>
<li><a href='home.html'>Home</a></li>
<li><a href='about.html'>About Us</a></li>
<li><a href='flightdetalis.jsp'>flight details</a></li>
<li><a href='viewbooking.jsp'>view booking</a></li>
<li><a href='ticketcancellation.jsp'>ticket cancellation</a></li>
<li><a href='viewtransactions.jsp'>Transactions</a></li>
</ul>
</center>

<body bgcolor="#A9A9A9">
<center>
<table align="left">
<tr><td><h2><U>FLIGHT DETAILS</h2></U></td></tr>
<tr>
	<td><b>source</b></td>
	<td>
		<select name='s' id="s" onchange="dest();">
			<option>select</option>
		</select>
	</td>
</tr>
<tr>
	<td><b>destination</b></td>
	<td>
		<select name='d' id="d">
			<option>select</option>
		</select>
	</td>
</tr>
<tr><td><input type="submit" value="search"></input></td></tr>
</table>
<table align="right">
<img src="image/sai.jpg" style="position: sticky; top: 20px; right: 0px;" height='200' width='400' border=1 ></img>
</table>
</form>
</center>
</body>
</html>
