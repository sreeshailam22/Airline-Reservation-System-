package com.utilities;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseConnectivity {
	private static boolean initialized = false;

	public static synchronized Connection getConnection()
	{
		Connection con=null;
		try {
			Class.forName("org.h2.Driver");
		} 
		catch (ClassNotFoundException e)
		{
			e.printStackTrace();
		}
		
		try
		{
			con=DriverManager.getConnection("jdbc:h2:~/airlinedb;MODE=Oracle;DB_CLOSE_DELAY=-1","ar","ar");
			if (!initialized) {
				initializeDatabase(con);
				initialized = true;
			}
		} 
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
		return con;		
	}
	
	private static void initializeDatabase(Connection con) {
		try {
			// Check if schema already initialized
			Statement checkSt = con.createStatement();
			try {
				ResultSet rs = checkSt.executeQuery("SELECT count(*) FROM USERDETALIS");
				rs.close();
				checkSt.close();
				System.out.println("Database already initialized.");
				return;
			} catch (SQLException sqle) {
				// Table does not exist, proceed with initialization
				System.out.println("Initializing database...");
			}
			
			InputStream is = DatabaseConnectivity.class.getResourceAsStream("/schema.sql");
			if (is == null) {
				is = DatabaseConnectivity.class.getClassLoader().getResourceAsStream("schema.sql");
			}
			if (is == null) {
				System.err.println("schema.sql not found!");
				return;
			}
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				if (line.trim().startsWith("--")) {
					continue;
				}
				sb.append(line).append("\n");
			}
			reader.close();
			
			String[] statements = sb.toString().split(";");
			Statement st = con.createStatement();
			for (String sql : statements) {
				String trimmedSql = sql.trim();
				if (!trimmedSql.isEmpty()) {
					try {
						st.execute(trimmedSql);
					} catch (SQLException e) {
						System.err.println("Error executing: " + trimmedSql);
						e.printStackTrace();
					}
				}
			}
			st.close();
			System.out.println("Database initialization completed successfully.");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		System.out.println(getConnection());
	}

	public static void close3All(Connection connection, Statement statement,
			ResultSet resultSet) {
		try {
			if (resultSet != null) resultSet.close();
			if (statement != null) statement.close();
			if (connection != null) connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}

