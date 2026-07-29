<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.sql.Connection"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="com.utilities.DatabaseConnectivity"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Transaction History</title>
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
width:200px;
font-weight:bold;
color:#ffffff;
background-color:#333300;
text-align:center;
padding:4px;
text-decoration:none;
text-transform:uppercase;
}
a:hover,a:active{ background-color:#00ff66;}

body {
    background-color: #A9A9A9;
    font-family: Arial, sans-serif;
}

table {
    border-collapse: collapse;
    width: 80%;
    margin-top: 20px;
    background-color: white;
}

th, td {
    border: 1px solid black;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #333300;
    color: white;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}
</style>
</head>

<body>
<center>
<ul>
<li><a href='home.html'>Home</a></li>
<li><a href='about.html'>About Us</a></li>
<li><a href='flightdetalis.jsp'>flight detalis</a></li>
<li><a href='viewbooking.jsp'>view booking</a></li>
<li><a href='ticketcancellation.jsp'>ticket cancellation</a></li>
<li><a href='viewtransactions.jsp'>Transactions</a></li>
</ul>

<h2><u>TRANSACTION HISTORY</u></h2>

<table>
<tr>
<th>Transaction ID</th>
<th>Date</th>
<th>Amount</th>
<th>Recipient Account</th>
<th>Sender Account</th>
<th>Booking ID</th>
</tr>
<%
Connection connection = null;
Statement statement = null;
ResultSet resultSet = null;
String query = "select * from TRANSACTION order by CAST(TRANSACTIONID AS INT) desc";
try
{
connection  = DatabaseConnectivity.getConnection();
statement = connection.createStatement();
resultSet = statement.executeQuery(query);
while(resultSet.next())
{
%>
<tr>
<td><%=resultSet.getString(1) %></td>
<td><%=resultSet.getString(2) %></td>
<td><%=resultSet.getString(3) %></td>
<td><%=resultSet.getString(4) %></td>
<td><%=resultSet.getString(5) %></td>
<td><%=resultSet.getString(6) %></td>
</tr>
<%	
}
}
catch(Exception e)
{
	e.printStackTrace();
}
finally
{
	DatabaseConnectivity.close3All(connection, statement, resultSet);
}
%>
</table>
</center>
</body>
</html>
