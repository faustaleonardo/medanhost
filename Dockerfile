FROM faustaleonardo/medanhost-base

COPY . .

EXPOSE 5050

CMD ["npm", "run", "start:prod"]