FROM golang

WORKDIR /home/app

COPY api /home/app/api

COPY dist /home/app/dist

COPY go* main.go /home/app/

RUN go mod download && go build -o goland

CMD [ "./goland" ]
