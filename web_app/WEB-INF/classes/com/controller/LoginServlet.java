package com.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.utilities.DatabaseConnectivity;;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
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
		// TODO Auto-generated method stub
		
		response.setContentType("text/html");
		
		String username = request.getParameter("uname");
		System.out.println(" username is:::" + username);
		String password = request.getParameter("password");
		System.out.println(" password is:::" + password);
		
		Connection connection=null;
		Statement statement = null;
		ResultSet resultSet = null;
		
		String query = "select * from userdetalis where userid='"+username+"' and password='"+password+"'";
		
		connection = DatabaseConnectivity.getConnection();
		try {
			statement = connection.createStatement();
			resultSet = statement.executeQuery(query);
			
			if(resultSet.next())
			{

				HttpSession httpSession = request.getSession(true);
				httpSession.setAttribute("uname", username);
				
				RequestDispatcher dispatcher = request.getRequestDispatcher("home.html");
				dispatcher.include(request, response);
				
			}
			else
			{
				response.getWriter().print("invalid credentials");
				RequestDispatcher dispatcher = request.getRequestDispatcher("login.html");
				dispatcher.include(request, response);
				
			}
			
			
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally
		{
			DatabaseConnectivity.close3All(connection, statement, resultSet);
		}
		
	}

}
