FROM node:16-alpine3.15

RUN mkdir -p /data 
# RUN npm i --location=global aws-cdk
COPY . /data
COPY pipe /
COPY pipe.yml /

RUN wget -P / https://bitbucket.org/bitbucketpipelines/bitbucket-pipes-toolkit-bash/raw/0.6.0/common.sh \
    && chmod a+x /*.sh \
    && apk add bash git openssh

WORKDIR /data

RUN chown -R node:node /data 

USER node

ENTRYPOINT [ "/pipe.sh" ]