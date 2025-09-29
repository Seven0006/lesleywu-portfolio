# Use an official Java image as the base
FROM openjdk:17-jdk-slim

# Create a directory 'app' in the container where the app will live
WORKDIR /app

# Copy JAR file from host into the container
COPY target/finance-app.jar /app/app.jar

# The command to run when the container starts:
CMD ["java", "-jar", "app.jar"]
