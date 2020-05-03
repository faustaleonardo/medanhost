SHA=$(git rev-parse HEAD)

docker build -t faustaleonardo/medanhost:$SHA -t faustaleonardo/medanhost:latest .

# docker run -d -p 5050:5050 faustaleonardo/medanhost:$SHA

docker push faustaleonardo/medanhost:latest
docker push faustaleonardo/medanhost:$SHA
