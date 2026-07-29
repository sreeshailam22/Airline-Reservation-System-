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

public class transaction extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
       
    public transaction() 
    {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession hs1=request.getSession();
		String amount=(String)hs1.getAttribute("cost");
		System.out.println("amount==="+amount);
		
		int dedAmount=Integer.parseInt(amount);
		
		HttpSession httpSession = request.getSession();
		String user=(String)httpSession.getAttribute("uname");
		System.out.println("user=="+user);
		
		String acNumber=request.getParameter("accno");
		System.out.println("acNumber===="+acNumber);
		
		String pinNumber=request.getParameter("pinno");
		System.out.println("pinNumber=="+pinNumber);
		
		Connection con=null;
		
		Statement st1=null;
		ResultSet rs1=null;
		
		Statement st2=null;
		
		
		Statement st3=null;
		ResultSet rs3=null;
		
		Statement st4=null;
		
		
		Statement st5=null;

		
		Statement st6=null;
		
		try
		{
			con = DatabaseConnectivity.getConnection();
		
			st1=con.createStatement();
			String query1="select * from ACCOUNTDETALIS where ACCNUMBER='"+acNumber+"' and PINNUMBER='"+pinNumber+"'";
			rs1=st1.executeQuery(query1);
			
			String mb=null;
			String acAmount=null;
			
			if(rs1.next())
			{
				mb=rs1.getString("MINIMUMBALENCE");
				acAmount=rs1.getString("AVAILABLEBALENCE");
				
				int minimumBalanc=Integer.parseInt(mb);
				int acAmount1=Integer.parseInt(acAmount);
				
				int newBalance=acAmount1-dedAmount;
				
				if(minimumBalanc>newBalance)
				{
					RequestDispatcher rd=request.getRequestDispatcher("NoAmountinAccount.jsp");
					rd.forward(request, response);
				}
				else
				{
					con.setAutoCommit(false);
					
					st2=con.createStatement();
					
					String query2="update ACCOUNTDETALIS set AVAILABLEBALENCE='"+newBalance+"' where ACCNUMBER='"+acNumber+"'";
					
					int n2=st2.executeUpdate(query2);
					
					if(n2>0)
					{
						st3=con.createStatement();
						
						String query3="select AVAILABLEBALENCE from ACCOUNTDETALIS where ACCNUMBER='31120883421'";
						rs3=st3.executeQuery(query3);
						String destAcbal=null;
						if(rs3.next())
						{
							destAcbal=rs3.getString("AVAILABLEBALENCE");
						}
						
						int destAcBalance=Integer.parseInt(destAcbal);
						int destNewBalance=destAcBalance+dedAmount;
						
						st4=con.createStatement();
						String query4="update ACCOUNTDETALIS set AVAILABLEBALENCE='"+destNewBalance+"' where ACCNUMBER='31120883421'";
						int n4=st4.executeUpdate(query4);
						
						if(n4>0)
						{
							//System.out.println("transaction successfulll..........");
							
							HttpSession hs3=request.getSession();
							String bookingId=(String)hs3.getAttribute("bookingid");
							
							
							st5=con.createStatement();
							
							String query5="insert into TRANSACTION values(TRANSACTIONID.nextval,sysdate,'"+dedAmount+"','31120883421','"+acNumber+"','"+bookingId+"')";
							int n5=st5.executeUpdate(query5);
							
							if(n5>0)
							{
								System.out.println("transaction successfulll..........");
								
								st6=con.createStatement();
								String query6="update BOOKING set STATUS='done' where BOOKINGID='"+bookingId+"'";
								
								int n6=st6.executeUpdate(query6);
								
								if(n6>0)
								{
									con.commit();
									RequestDispatcher rd=request.getRequestDispatcher("BookingSuccess.jsp");
									rd.forward(request, response);
								}
								
								
							}
							
						}
					}
					
					
				}
				
				
			}
			else
			{
				RequestDispatcher rd=request.getRequestDispatcher("InvalidAccountDetails.jsp");
				rd.forward(request, response);
			}
			
			
		}
		catch (Exception e) 
		{
			try {
				if (con != null) con.rollback();
			} catch (Exception se) {
				se.printStackTrace();
			}
			e.printStackTrace();
			// TODO: handle exception
		}
		
	}

}
