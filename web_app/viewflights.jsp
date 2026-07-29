<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.sql.Connection"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="com.utilities.DatabaseConnectivity"%><html>
<head>

<jsp:include page="flightdetalis.jsp"></jsp:include>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>

<script type="text/javascript">

function booktheFlght(ev)
{
	alert("----"+ev.id);

	var flightId=ev.id;

	  window.location.assign("noofpeople.html?fid="+flightId+"");
	//window.location("noofpeople.html");

	
}

</script>



</head>

<body>
<center>
<table>
<tr>
<th>Flight name</th>
<th>Cost</th>
<th>Book</th>
</tr>
<%
String s= request.getParameter("s");
String d= request.getParameter("d");

System.out.println(s);
System.out.println(d);

Connection connection = null;
Statement statement = null;
ResultSet  resultSet = null;
String query = "select * from FLIGHTDETALIS where SOURCE='"+s+"' and DEST='"+d+"'";
try
{
connection  = DatabaseConnectivity.getConnection();
statement = connection.createStatement();
resultSet = statement.executeQuery(query);
while(resultSet.next())
{
%>
<tr>
<td><%=resultSet.getString(2) %></td>
<td><%=resultSet.getString(7) %></td>
<td><input type="button" value="Book" id="<%=resultSet.getString(1)%>" onclick="booktheFlght(this)"></input></td>
</tr>
<%	
}
}
catch(Exception e)
{
	e.printStackTrace();
}

%>
</table>

</center>
</body>
</html>