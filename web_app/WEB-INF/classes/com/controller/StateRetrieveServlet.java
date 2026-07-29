package com.controller;

import gvjava.org.json.JSONArray;
import gvjava.org.json.JSONException;
import gvjava.org.json.JSONObject;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.utilities.DatabaseConnectivity;;

/**
 * Servlet implementation class StateRetrieveServlet
 */
public class StateRetrieveServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public StateRetrieveServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
String co = request.getParameter("co");
		System.out.println(co);
		Connection connection =null;
		Statement statement = null;
		ResultSet resultSet = null;
		
		String query = "select * from state where countryid='"+co+"'";
		System.out.println(query);
		connection = DatabaseConnectivity.getConnection();
		try {
			statement = connection.createStatement();
			resultSet = statement.executeQuery(query);
			
			JSONArray array = new JSONArray();
			while(resultSet.next())
			{
				JSONObject jsonObject = new JSONObject();
				try {
					jsonObject.put("sid", resultSet.getString(1));
					jsonObject.put("sname", resultSet.getString(2));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				array.put(jsonObject);
			}
			
			JSONObject jsonObject = new JSONObject();
			try {
				jsonObject.put("state", array);
				response.getWriter().print(jsonObject);
				
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
