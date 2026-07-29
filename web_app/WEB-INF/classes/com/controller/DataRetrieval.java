package com.controller;

import gvjava.org.json.JSONArray;
import gvjava.org.json.JSONException;
import gvjava.org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.utilities.DatabaseConnectivity;

/**
 * Servlet implementation class DataRetrieval
 */
public class DataRetrieval extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public DataRetrieval() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String action=request.getParameter("action");
		System.out.println(action);
		if(action.equals("country"))
		{
			getCountries(request, response);
		}
		if(action.equals("state"))
		{
			getstates(request, response);
		}
		if(action.equals("city"))
		{
			getcity(request, response);
		}
		
		}
		
	protected void getCountries (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		// TODO Auto-generated method stub
		Connection con=DatabaseConnectivity .getConnection();
		Statement st;
		try {
			st = con.createStatement();
		
		
        String query="select * from country";
		ResultSet rs;
		
			rs = st.executeQuery(query);
			JSONArray arr=new JSONArray();
			JSONObject mainobj=null;
			
		try {
			while(rs.next())
			{
			JSONObject obj=new JSONObject();
			obj.put("countryid", rs.getString(1));
			obj.put("countryname", rs.getString(2));

			arr.put(obj);
			
			}
			mainobj=new JSONObject();
			mainobj.put("country", arr);
			PrintWriter out=response.getWriter();
			out.print(mainobj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	} catch (SQLException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}	
}
	
	
	protected void getstates(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		// TODO Auto-generated method stub
		Connection con=DatabaseConnectivity .getConnection();
		Statement st;
		try {
			st = con.createStatement();
        String query="select * from state";
		ResultSet rs;
		
			rs = st.executeQuery(query);
			JSONArray arr=new JSONArray();
			JSONObject mainobj=null;
			
		try {
			while(rs.next())
			{
			JSONObject obj=new JSONObject();
			obj.put("stateid", rs.getString(1));
			obj.put("statename", rs.getString(2));

			arr.put(obj);
			
			}
			mainobj=new JSONObject();
			mainobj.put("state", arr);
			PrintWriter out=response.getWriter();
			out.print(mainobj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	} catch (SQLException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
	}
	protected void getcity(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		// TODO Auto-generated method stub
		Connection con=DatabaseConnectivity .getConnection();
		Statement st;
		try {
			st = con.createStatement();
        String query="select * from city";
		ResultSet rs;
		
			rs = st.executeQuery(query);
			JSONArray arr=new JSONArray();
			JSONObject mainobj=null;
			
		try {
			while(rs.next())
			{
			JSONObject obj=new JSONObject();
			obj.put("cityid", rs.getString(1));
			obj.put("cityname", rs.getString(2));

			arr.put(obj);
			
			}
			mainobj=new JSONObject();
			mainobj.put("city", arr);
			PrintWriter out=response.getWriter();
			out.print(mainobj);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	} catch (SQLException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
	}
}
	
