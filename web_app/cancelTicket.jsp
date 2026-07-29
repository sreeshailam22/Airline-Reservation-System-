<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@page import="java.sql.*"%>
<%@page import="com.utilities.DatabaseConnectivity"%>
<%
String username = (String) session.getAttribute("uname");
if (username == null) {
    response.sendRedirect("login.html");
    return;
}

String bookingId = request.getParameter("bookingId");
if (bookingId == null || bookingId.trim().isEmpty()) {
    response.sendRedirect("ticketcancellation.jsp?error=Invalid+Booking+ID");
    return;
}

Connection con = null;
Statement st = null;
ResultSet rs = null;

try {
    con = DatabaseConnectivity.getConnection();
    con.setAutoCommit(false);
    
    // 1. Fetch booking info to verify user and get details
    st = con.createStatement();
    rs = st.executeQuery("select USERID, STATUS, COST, NOOFPEOPLE from BOOKING where BOOKINGID = '" + bookingId + "'");
    if (!rs.next()) {
        response.sendRedirect("ticketcancellation.jsp?error=Booking+not+found");
        return;
    }
    
    String userId = rs.getString(1);
    String status = rs.getString(2);
    int cost = Integer.parseInt(rs.getString(3));
    int noofpeople = Integer.parseInt(rs.getString(4));
    int totalRefund = cost * noofpeople;
    
    if (!username.equalsIgnoreCase(userId)) {
        response.sendRedirect("ticketcancellation.jsp?error=Unauthorized+operation");
        return;
    }
    
    if ("cancelled".equalsIgnoreCase(status)) {
        response.sendRedirect("ticketcancellation.jsp?error=Ticket+already+cancelled");
        return;
    }
    
    rs.close();
    st.close();
    
    // 2. Perform Refund if booking status is 'done' (meaning it was paid)
    if ("done".equalsIgnoreCase(status)) {
        // Find the transaction to get the user's bank account
        st = con.createStatement();
        rs = st.executeQuery("select ACCOUNTNUMBER from TRANSACTION where BOOKINGID = '" + bookingId + "'");
        String userAccount = null;
        if (rs.next()) {
            userAccount = rs.getString(1);
        }
        rs.close();
        st.close();
        
        if (userAccount != null) {
            // Deduct totalRefund from airline account '31120883421'
            // Get current airline balance
            st = con.createStatement();
            rs = st.executeQuery("select AVAILABLEBALENCE from ACCOUNTDETALIS where ACCNUMBER = '31120883421'");
            int airlineBalance = 0;
            if (rs.next()) {
                airlineBalance = Integer.parseInt(rs.getString(1));
            }
            rs.close();
            st.close();
            
            int newAirlineBalance = airlineBalance - totalRefund;
            st = con.createStatement();
            st.executeUpdate("update ACCOUNTDETALIS set AVAILABLEBALENCE = '" + newAirlineBalance + "' where ACCNUMBER = '31120883421'");
            st.close();
            
            // Refund totalRefund back to user account
            st = con.createStatement();
            rs = st.executeQuery("select AVAILABLEBALENCE from ACCOUNTDETALIS where ACCNUMBER = '" + userAccount + "'");
            int userBalance = 0;
            if (rs.next()) {
                userBalance = Integer.parseInt(rs.getString(1));
            }
            rs.close();
            st.close();
            
            int newUserBalance = userBalance + totalRefund;
            st = con.createStatement();
            st.executeUpdate("update ACCOUNTDETALIS set AVAILABLEBALENCE = '" + newUserBalance + "' where ACCNUMBER = '" + userAccount + "'");
            st.close();
            
            // Log the refund transaction
            st = con.createStatement();
            st.executeUpdate("insert into TRANSACTION values(TRANSACTIONID.nextval, sysdate, '" + totalRefund + "', '" + userAccount + "', '31120883421', '" + bookingId + "')");
            st.close();
        }
    }
    
    // 3. Update Booking status to 'cancelled'
    st = con.createStatement();
    st.executeUpdate("update BOOKING set STATUS = 'cancelled' where BOOKINGID = '" + bookingId + "'");
    st.close();
    
    con.commit();
    response.sendRedirect("ticketcancellation.jsp?msg=Ticket+cancelled+successfully.+Refund+of+" + totalRefund + "+processed.");
    
} catch (Exception e) {
    e.printStackTrace();
    try {
        if (con != null) con.rollback();
    } catch (Exception ex) {}
    response.sendRedirect("ticketcancellation.jsp?error=Error+cancelling+ticket:+" + e.getMessage());
} finally {
    DatabaseConnectivity.close3All(con, st, rs);
}
%>
