FROM tomcat:8.0.15-jre8

#RUN mkdir -p /usr/local/tomcat/db2 /usr/local/tomcat/mq /usr/local/tomcat/wasejb

RUN set -x \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		vim \
		wget \
		curl \		
	&& rm -rf /var/lib/apt/lists/*
	
ADD conf /usr/local/tomcat/conf
ADD lib /usr/local/tomcat/lib
ADD properties /usr/local/tomcat/properties

ADD bin /usr/local/tomcat/bin
ADD cert /usr/local/tomcat/certs


#ADD db2 /usr/local/tomcat/db2
#ADD mq /usr/local/tomcat/mq
#ADD wasejb /usr/local/tomcat/wasejb

########  Start: Create and copy UI to webapps

ADD sources/ui/Pricing_UI /usr/local/sources/ui/Pricing_UI	


RUN apt-get update && \
    apt-get install --fix-missing -y nodejs nodejs-legacy && \
	apt-get install --fix-missing -y npm  && \
	apt-get install -y git

	
RUN nodejs --version
RUN npm install -g grunt-cli bower tsd
RUN cd /usr/local/sources/ui/Pricing_UI; npm install
RUN cd /usr/local/sources/ui/Pricing_UI; bower --allow-root install
RUN cd /usr/local/sources/ui/Pricing_UI; tsd install
RUN npm install grunt-cli
RUN cd /usr/local/sources/ui/Pricing_UI; grunt war
RUN cp /usr/local/sources/ui/Pricing_UI/dist/*.war /usr/local/tomcat/webapps
########  End: Create and copy UI to webapps

ADD webapps /usr/local/tomcat/webapps

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 /usr/local/tomcat

RUN chmod -R ug+rw /usr/local/tomcat

RUN chmod -R ug+rwx /usr/local/tomcat/bin/addldapcert.sh

RUN /usr/local/tomcat/bin/addldapcert.sh



# Set the default user for the image, the user itself was created in the base image
USER 1001



EXPOSE 8052

CMD ["/bin/bash"]
#CMD ["catalina.sh", "run"]
