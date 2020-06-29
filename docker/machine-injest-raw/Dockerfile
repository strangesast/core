FROM golang:alpine as build

WORKDIR /app
COPY machine-injest-raw/go.mod machine-injest-raw/go.sum ./
RUN go mod download

COPY machine-injest-raw/ .
RUN mkdir /build && CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /build .

FROM scratch
#FROM alpine
COPY --from=build /build /app
CMD ["/app/serial-monitoring"]
