# Use official Tomcat 9 image with Java 11
FROM tomcat:9.0-jdk11-openjdk-slim

# Remove default web applications to clean up
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the compiled war file into Tomcat's webapps folder as airlinereservation.war
COPY airlinereservation1.war /usr/local/tomcat/webapps/ROOT.war

# Set environment variables if needed
ENV PORT 8080
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
