FROM openjdk:11
COPY target/wbs-project-v1.jar /home/wbs-project.jar
RUN mkdir -p db/dataset
CMD ["java","-jar","/home/wbs-project.jar"]