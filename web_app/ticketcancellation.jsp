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
<title>Ticket Cancellation</title>
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

.btn-cancel {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
}
.btn-cancel:hover {
    background-color: darkred;
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

<h2><u>TICKET CANCELLATION</u></h2>

<%
if (request.getParameter("msg") != null) {
%>
    <div style="color: green; font-weight: bold; margin: 10px;"><%= request.getParameter("msg") %></div>
<%
}
if (request.getParameter("error") != null) {
%>
    <div style="color: red; font-weight: bold; margin: 10px;"><%= request.getParameter("error") %></div>
<%
}
%>

<table>
<tr>
<th>Booking ID</th>
<th>Flight ID</th>
<th>No. of Passengers</th>
<th>Date</th>
<th>Cost</th>
<th>Status</th>
<th>Action</th>
</tr>
<%
Connection connection = null;
Statement statement = null;
ResultSet resultSet = null;

String query = "select BOOKINGID, FID, NOOFPEOPLE, BOOKIGDATE, COST, STATUS from BOOKING where USERID = '" + username + "' order by CAST(BOOKINGID AS INT) desc";

try
{
connection  = DatabaseConnectivity.getConnection();
statement = connection.createStatement();
resultSet = statement.executeQuery(query);
boolean found = false;
while(resultSet.next())
{
    found = true;
    String bid = resultSet.getString(1);
    String fid = resultSet.getString(2);
    String nopeople = resultSet.getString(3);
    String bdate = resultSet.getString(4);
    String cost = resultSet.getString(5);
    String status = resultSet.getString(6);
%>
<tr>
<td><%=bid %></td>
<td><%=fid %></td>
<td><%=nopeople %></td>
<td><%=bdate %></td>
<td><%=cost %></td>
<td style="font-weight: bold; color: <%= "done".equalsIgnoreCase(status) ? "green" : ("cancelled".equalsIgnoreCase(status) ? "red" : "orange") %>;">
    <%=status.toUpperCase() %>
</td>
<td>
    <% if ("done".equalsIgnoreCase(status) || "pending".equalsIgnoreCase(status)) { %>
        <form action="cancelTicket.jsp" method="post" style="margin:0;" onsubmit="return confirm('Are you sure you want to cancel this ticket?');">
            <input type="hidden" name="bookingId" value="<%= bid %>"></input>
            <input type="submit" class="btn-cancel" value="Cancel Ticket"></input>
        </form>
    <% } else { %>
        N/A
    <% } %>
</td>
</tr>
<%	
}
if (!found) {
%>
<tr>
<td colspan="7" style="text-align: center; color: red; font-weight: bold;">No bookings found.</td>
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
