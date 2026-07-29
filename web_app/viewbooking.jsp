<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.sql.Connection"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="com.utilities.DatabaseConnectivity"%>
<%
String username = (String) session.getAttribute("uname");
if (username == null) {
    response.sendRedirect("login.html");
    return;
}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>My Bookings</title>
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

.search-box {
    margin: 20px;
    padding: 10px;
    background-color: white;
    width: 60%;
    border: 1px solid #333300;
    text-align: left;
}

.search-box input[type="text"] {
    padding: 5px;
    width: 200px;
}

.search-box input[type="submit"] {
    padding: 5px 15px;
    background-color: #333300;
    color: white;
    border: none;
    cursor: pointer;
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

<h2><u>MY BOOKINGS</u></h2>

<div class="search-box">
    <form action="viewbooking.jsp" method="get">
        <b>Search by Booking ID: </b>
        <input type="text" name="bookingId" placeholder="Enter Booking ID" value="<%= request.getParameter("bookingId") != null ? request.getParameter("bookingId") : "" %>"></input>
        <input type="submit" value="Search"></input>
        <a href="viewbooking.jsp" style="display:inline; margin-left: 10px; text-decoration: underline; color: #333300;">Show All</a>
    </form>
</div>

<table>
<tr>
<th>Booking ID</th>
<th>Flight ID</th>
<th>No. of Passengers</th>
<th>Date</th>
<th>Cost</th>
<th>Status</th>
</tr>
<%
String bookingIdFilter = request.getParameter("bookingId");
Connection connection = null;
Statement statement = null;
ResultSet resultSet = null;

String query = "select BOOKINGID, FID, NOOFPEOPLE, BOOKIGDATE, COST, STATUS from BOOKING where USERID = '" + username + "'";
if (bookingIdFilter != null && !bookingIdFilter.trim().isEmpty()) {
    query += " and BOOKINGID = '" + bookingIdFilter.trim() + "'";
}
query += " order by CAST(BOOKINGID AS INT) desc";

try
{
connection  = DatabaseConnectivity.getConnection();
statement = connection.createStatement();
resultSet = statement.executeQuery(query);
boolean found = false;
while(resultSet.next())
{
    found = true;
%>
<tr>
<td><%=resultSet.getString(1) %></td>
<td><%=resultSet.getString(2) %></td>
<td><%=resultSet.getString(3) %></td>
<td><%=resultSet.getString(4) %></td>
<td><%=resultSet.getString(5) %></td>
<td style="font-weight: bold; color: <%= "done".equalsIgnoreCase(resultSet.getString(6)) ? "green" : "orange" %>;">
    <%=resultSet.getString(6).toUpperCase() %>
</td>
</tr>
<%	
}
if (!found) {
%>
<tr>
<td colspan="6" style="text-align: center; color: red; font-weight: bold;">No bookings found.</td>
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
