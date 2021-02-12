# How to start

1. `npm i`
2. Check if you have `sequelize-cli`, else install it
3. Copy `config/config.example.json` as `config/config.json` and change it according to your database
4. `npx sequelize-cli db:migrate`
5. `npx sequelize-cli db:seed:all` (if you want to have default users in database from beginning)
6. `npm start`
7. Start frontend