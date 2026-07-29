<%@ page language="java" contentType="application/json; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@page import="java.sql.*"%>
<%@page import="com.utilities.DatabaseConnectivity"%>
<%@page import="gvjava.org.json.JSONObject"%>
<%
String id = request.getParameter("id");
Connection con = null;
Statement st = null;
ResultSet rs = null;
JSONObject json = new JSONObject();
try {
    con = DatabaseConnectivity.getConnection();
    st = con.createStatement();
    rs = st.executeQuery("select NOOFPEOPLE, BOOKIGDATE, COST, STATUS from BOOKING where BOOKINGID='" + id + "'");
    if (rs.next()) {
        json.put("found", true);
        json.put("noofpeople", rs.getString(1));
        json.put("date", rs.getString(2));
        json.put("cost", rs.getString(3));
        json.put("status", rs.getString(4));
    } else {
        json.put("found", false);
    }
} catch (Exception e) {
    e.printStackTrace();
    try { json.put("found", false); } catch(Exception ex) {}
} finally {
    DatabaseConnectivity.close3All(con, st, rs);
}
out.print(json.toString());
%>
