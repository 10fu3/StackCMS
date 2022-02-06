FROM golang:stretch AS builder
WORKDIR /go/src/app
COPY .. .
RUN go build -o server

#final stage
FROM gcr.io/distroless/base
COPY --from=builder /go/src/app/server /app
ENV PORT=${PORT}
ENTRYPOINT [ "/app" ]
CMD [ "/server" ]