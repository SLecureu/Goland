FROM golang

WORKDIR /home/app

COPY api /home/app/api


COPY dist /home/app/dist

COPY go* main.go /home/app/

EXPOSE 8080

RUN go mod download && go build -o goland

CMD [ "./goland" ]
