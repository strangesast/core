from gradle:jdk14 as build

#run apt-get update && apt-get install -y automake wget libtool g++ autoconf make
#run wget -P /tmp https://github.com/protocolbuffers/protobuf/archive/v3.12.3.tar.gz && \
#  cd /tmp && tar -xf v3.12.3.tar.gz && \
#  cd /tmp/protobuf-3.12.3 && \
#  ./autogen.sh && \
#  ./configure --prefix=/usr && \
#  make -j 4 && \
#  make install

#run cd /tmp/protobuf-3.12.3/java && mvn package -Dmaven.test.skip=true

#run wget -P /tmp https://github.com/grpc/grpc-java/archive/v1.30.2.tar.gz && cd /tmp && tar -xf v1.30.2.tar.gz
#run cd /tmp/grpc-java-1.30.2/compiler && ../gradlew java_pluginExecutable -PskipAndroid=true

#from arm32v7/gradle as build

workdir /home/gradle/src

#run mkdir -p libs
#copy --from=protobuf /tmp/protobuf-3.12.3/java/core/target/protobuf-java-3.12.3.jar ./libs/

#copy kafka-streams/build.gradle kafka-streams/settings.gradle kafka-streams/gradlew kafka-streams/gradle ./
#RUN gradle build --no-daemon || return 0 
copy kafka-streams /home/gradle/src
run gradle build --no-daemon --debug --stacktrace --scan

from adoptopenjdk

workdir /app
copy --from=build /home/gradle/src/build/libs/*.jar /app/

entrypoint ["java", "-jar", "serial-monitoring-1.0-SNAPSHOT-all.jar"]
