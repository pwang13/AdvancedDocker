FROM    alpine:3.2
MAINTAINER  pwang13@ncsu.edu

RUN apk update && apk add socat
RUN echo "Hello World" | cat > testFile.txt;

EXPOSE 9001
CMD socat TCP4-LISTEN:9001,reuseaddr,fork,crlf SYSTEM:"cat testFile.txt" | sh