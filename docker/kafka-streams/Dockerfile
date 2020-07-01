from gradle:jdk14 as build

workdir /home/gradle/src

#copy kafka-streams/build.gradle kafka-streams/settings.gradle kafka-streams/gradlew kafka-streams/gradle ./
#RUN gradle build --no-daemon || return 0 
copy kafka-streams /home/gradle/src
run gradle build --no-daemon --debug --stacktrace --scan

from adoptopenjdk

workdir /app
copy --from=build /home/gradle/src/build/libs/*.jar /app/

entrypoint ["java", "-jar", "serial-monitoring-1.0-SNAPSHOT-all.jar"]
