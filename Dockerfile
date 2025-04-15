# Use an official Java image as the base
FROM openjdk:8-jdk-alpine

# Create a directory 'app' in the container where the app will live
WORKDIR /app

# Copy JAR file from host into the container
COPY target/docker-lab-assignment-1.0-SNAPSHOT.jar /app/app.jar

# The command to run when the container starts:
CMD ["java", "-jar", "app.jar"]
