package com.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.utilities.DatabaseConnectivity;

public class book extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
       
    public book() 
    {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		Connection con =null;
		Statement st = null;
		
		String noPeople=request.getParameter("noofpeople");
		System.out.println("noPeople=="+noPeople);
		
		String flightId=request.getParameter("flightName");
		System.out.println("flightId==="+flightId);
	
		
		HttpSession httpSession = request.getSession();
		String user=(String)httpSession.getAttribute("uname");
		System.out.println("user=="+user);
		
		Statement st1=null;
		ResultSet rs1=null;
		
		
		Statement st4=null;
		ResultSet rs4=null;
		
		try
		{
			con = DatabaseConnectivity.getConnection();
		
			st1=con.createStatement();
			String query1="select COST from FLIGHTDETALIS where FID='"+flightId+"'";
			String c=null;
			rs1=st1.executeQuery(query1);
			
			if(rs1.next())
			{
				c=rs1.getString(1);
			}
			
			int cost=Integer.parseInt(c);
			int noofPass=Integer.parseInt(noPeople);
			
			int totalcost=cost*noofPass;
			System.out.println("totalcost=="+totalcost);
			
			HttpSession hs1=request.getSession(false);
			hs1.setAttribute("cost", ""+totalcost);
			
			st4=con.createStatement();
			String query4="select bookingid.nextval from dual";
			rs4=st4.executeQuery(query4);
			
			String bookingid=null;
			if(rs4.next())
			{
				bookingid=rs4.getString(1);
			}
			
			HttpSession hs3=request.getSession(true);
			hs3.setAttribute("bookingid", bookingid);
			
			
			st = con.createStatement();
			String query = "insert into booking values('"+bookingid+"','"+noPeople+"',sysdate,'"+cost+"','"+flightId+"','"+user+"','pending')";
			int n=st.executeUpdate(query);
			
			if(n>0)
			{
				RequestDispatcher rd=request.getRequestDispatcher("transaction.html");
				rd.forward(request, response);
			}
		}
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}

}
