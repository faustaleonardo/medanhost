$SHA=(git rev-parse HEAD)

docker build -t faustaleonardo/medanhost:$SHA .
# docker push faustaleonardo/medanhost:latest
