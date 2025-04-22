How to Run:

- Utilize Bun instead of Node or Yarn (As requested)

- Open the command terminal and move to the backend folder 
	- cd ./backend

- Install all Bun dependencies:
	- bun install axios
	- bun install express
	- bun install jsdom
	- bun add cors
	- Might also have to manually add vary: 
		- bun add vary

- Run the express server to initialize the API
	- bun run ./src/server.js

- Move to the frontend folder
	- cd ../frontend

- Initialize the vite testing server
	- bun run dev

- The web application should open on http://localhost:5173/

- Done! Any questions / problems about running the application and I'll gladly answer:
	- Email me at extralg21@gmail.com