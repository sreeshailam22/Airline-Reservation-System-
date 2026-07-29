package com.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.utilities.DatabaseConnectivity;;

/**
 * Servlet implementation class UserRegistrationServlet
 */
public class UserRegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserRegistrationServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stubresponse.setContentType("text/html");
		
		String firstname = request.getParameter("fname");
		System.out.println(" username is:::" +firstname);
		String lastname = request.getParameter("lname");
		System.out.println(" username is:::" + lastname);
		String gender = request.getParameter("gender");
		System.out.println(" username is:::" + gender);
		String dob = request.getParameter("dob");
		System.out.println(" username is:::" + dob);
		String password = request.getParameter("password");
		System.out.println(" username is:::" + password);
		String email = request.getParameter("email");
		System.out.println(" username is:::" + email);
		String phonenumber = request.getParameter("phno");
		System.out.println(" username is:::" + phonenumber);
		String address = request.getParameter("address");
		System.out.println(" username is:::" + address);
		
		String cityid = request.getParameter("cityid");
		System.out.println(" cityid is:::" + cityid);
		
		Connection connection = null;
		Statement statement = null;

		String query = "insert into userdetalis values('"+email+"','"
				+ firstname + "','" + lastname + "','" + gender + "','" + dob
				+ "','" + password + "','" + phonenumber
				+ "','" + address + "','" + cityid + "')";
         System.out.println("query is ::"+query);
		int i=0;
		connection = DatabaseConnectivity.getConnection();
		
		try {
			statement = connection.createStatement();
			i= statement.executeUpdate(query);
			
			if(i>0)
				
			{
				System.out.println("..........if...........");
			
				RequestDispatcher dispatcher = request.getRequestDispatcher("login.html");
				dispatcher.forward(request, response);
				
			}
			else
			{
				response.getWriter().print("registration fail");
				RequestDispatcher dispatcher
				= request.getRequestDispatcher("Registration.html");
				dispatcher.include(request, response);				
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
